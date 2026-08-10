#!/bin/sh
# Resolve deployment-specific placeholders in the baked Orthanc configuration, then
# hand off to Orthanc.
#
# Why this exists: Ozone's env-substitution service only rewrites the distro tree it
# bind-mounts from the host, and it does not process .js files at all. Both files
# handled here are baked into this image, so nothing else can reach them. This used to
# be done by post-start.sh on the host after start.sh; doing it here means the config
# is correct the moment the container is up, and works identically in a pull-only
# deployment where no distro tree exists.
#
# TWO files, not one. app-config.js was covered from the start; orthanc.json was not,
# and that was a silent, total failure: OrthancExplorer2 received the literal string
# "${SERVER_SCHEME}://${KEYCLOAK_HOSTNAME}/" as its Keycloak URL, handed it to
# keycloak-js, initialisation threw, and the UI rendered a blank page with no error
# shown to the user. The Orthanc REST API also returned 403 throughout, because the
# authorization plugin wants a token the login flow could never obtain.
#
# orthanc.json now uses ${KEYCLOAK_URL} and ${PACS_PUBLIC_URL} — the names already
# supplied to this container by the compose files — rather than ${SERVER_SCHEME},
# ${KEYCLOAK_HOSTNAME} and ${ORTHANC_HOSTNAME}, which are not passed in and so could
# never have been resolved here.
#
# Keeping these as variables matters beyond tidiness: PACS_PUBLIC_URL currently points
# at a temporary subpath on the site domain because the PACS subdomain has no DNS
# record yet. When that record is added the deployment changes the variable and this
# config follows automatically, with no edit to the distro or a rebuilt image.
#
# sed, not envsubst: blanket envsubst would eat any legitimate $-syntax in the JS, and
# would blank ${OHIF_ROUTER_BASENAME}, which is computed below rather than passed in.
set -e

OHIF_CONFIG="${OHIF_CONFIG:-/usr/share/orthanc/ohif/app-config.js}"
ORTHANC_CONFIG="${ORTHANC_CONFIG:-/etc/orthanc/orthanc.json}"

# subst <file> <name> <value>
subst() {
  _file="$1"
  _name="$2"
  _value="$3"
  if [ -z "$_value" ]; then
    echo "orthanc-entrypoint: WARNING \${$_name} is unset; leaving the placeholder" \
         "in $_file rather than blanking it" >&2
    return 0
  fi
  sed -i "s|\${$_name}|$_value|g" "$_file"
}

# resolve <file> — substitute every known placeholder, then report leftovers.
resolve() {
  _target="$1"
  if [ ! -f "$_target" ]; then
    echo "orthanc-entrypoint: $_target not present, nothing to substitute"
    return 0
  fi
  echo "orthanc-entrypoint: resolving placeholders in $_target"
  subst "$_target" KEYCLOAK_URL         "$KEYCLOAK_URL"
  subst "$_target" PACS_PUBLIC_URL      "$PACS_PUBLIC_URL"
  subst "$_target" OPENMRS_PUBLIC_URL   "$OPENMRS_PUBLIC_URL"
  # Computed above from PACS_PUBLIC_URL rather than passed in by compose.
  subst "$_target" OHIF_ROUTER_BASENAME "$OHIF_ROUTER_BASENAME"

  _remaining="$(grep -oE '\$\{[A-Z_]+\}' "$_target" 2>/dev/null | sort -u | tr '\n' ' ' || true)"
  if [ -n "$_remaining" ]; then
    # Loud, because an unresolved placeholder in orthanc.json is not cosmetic: it
    # produces a blank UI rather than a visible error.
    echo "orthanc-entrypoint: WARNING unresolved placeholders remain in $_target:" \
         "$_remaining" >&2
  fi
}

# OHIF's RouterBasename is the base path the VIEWER'S OWN CLIENT-SIDE ROUTER uses when it
# navigates, so it has to be the path the browser sees — not the path Orthanc serves on.
# Those differ whenever Orthanc is reached through a subpath: Traefik strips /pacs, so
# Orthanc serves /ohif/... while the browser must be sent to /pacs/ohif/...
#
# It was hardcoded "/ohif". app-config.js was already /pacs-aware (resolve() below fills
# its roots from PACS_PUBLIC_URL), so the viewer loaded at /pacs/ohif/ and then its router
# pushed /ohif/viewer — a path Traefik does not route to Orthanc at all. Result: the study
# opened from OrthancExplorer2 and returned 404, with a valid token, which reads as a
# broken OHIF deployment rather than a base-path bug. Reported from UAT testing as
# "OHIF viewer link returns 404".
#
# That fix was correct but INERT until 2026-08-10, and the 404s continued, because
# orthanc.json spelled the section "Ohif" while the plugin reads "OHIF" — Orthanc's
# configuration keys are case-sensitive and an unknown section is silently ignored, so
# RouterBasename, DataSource and UserConfiguration were all discarded together. Confirmed
# by extracting the strings from libOrthancOHIF.so: it contains exactly one section token,
# "OHIF", alongside the message 'Configuration option "OHIF.DataSource" must be either',
# and no "Ohif" anywhere. The served /ohif/app-config.js proved it from the other side —
# it carried the plugin's own default, window.config.routerBasename = '/ohif/', rather
# than the value computed here.
#
# Derived rather than hardcoded so it survives the DNS change that is already planned:
#   PACS_PUBLIC_URL=https://host/pacs   -> /pacs/ohif   (today, temporary subpath)
#   PACS_PUBLIC_URL=https://pacs.host   -> /ohif        (once the PACS A record exists)
if [ -n "$PACS_PUBLIC_URL" ]; then
  # Drop scheme://host, keep any path, drop a trailing slash. A bare host yields "".
  _pacs_path="$(printf '%s' "$PACS_PUBLIC_URL" \
    | sed -E 's#^[a-zA-Z][a-zA-Z0-9+.-]*://[^/]+##; s#/+$##')"
  OHIF_ROUTER_BASENAME="${_pacs_path}/ohif"
  echo "orthanc-entrypoint: OHIF RouterBasename = $OHIF_ROUTER_BASENAME" \
       "(from PACS_PUBLIC_URL=$PACS_PUBLIC_URL)"
else
  # subst() leaves the placeholder and warns when a value is empty, which for this key
  # would break the viewer outright, so fall back to the path-less default.
  OHIF_ROUTER_BASENAME="/ohif"
  echo "orthanc-entrypoint: WARNING PACS_PUBLIC_URL unset; OHIF RouterBasename" \
       "defaulting to /ohif" >&2
fi

resolve "$ORTHANC_CONFIG"
resolve "$OHIF_CONFIG"

# Hand off to the base image's own entrypoint, which arrives here with the image's
# default CMD (/tmp/orthanc.json) as "$@". That script reads every /etc/orthanc/*.json
# — including the file resolve() has just rewritten — merges the environment and the
# docker secrets over it, installs the .so of each enabled plugin, writes the result to
# /tmp/orthanc.json and execs Orthanc on it.
#
# It must run AFTER resolve(): its own env-var substitution would blank
# ${OHIF_ROUTER_BASENAME}, which is computed in this script and is not an environment
# variable, and an empty RouterBasename breaks every OHIF navigation.
#
# Not /usr/local/sbin/Orthanc as before: that was Mekom's layout and does not exist in
# orthancteam's image (the binary is /usr/local/bin/Orthanc), and calling it directly
# would skip the plugin installation above, leaving Orthanc with no plugins at all.
exec /docker-entrypoint.sh "$@"
