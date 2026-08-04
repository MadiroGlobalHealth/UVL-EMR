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
# sed, not envsubst: gettext is not installed in mekomsolutions/orthanc, and blanket
# envsubst would also eat any legitimate $-syntax in the JS.
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
  subst "$_target" KEYCLOAK_URL       "$KEYCLOAK_URL"
  subst "$_target" PACS_PUBLIC_URL    "$PACS_PUBLIC_URL"
  subst "$_target" OPENMRS_PUBLIC_URL "$OPENMRS_PUBLIC_URL"

  _remaining="$(grep -oE '\$\{[A-Z_]+\}' "$_target" 2>/dev/null | sort -u | tr '\n' ' ' || true)"
  if [ -n "$_remaining" ]; then
    # Loud, because an unresolved placeholder in orthanc.json is not cosmetic: it
    # produces a blank UI rather than a visible error.
    echo "orthanc-entrypoint: WARNING unresolved placeholders remain in $_target:" \
         "$_remaining" >&2
  fi
}

resolve "$ORTHANC_CONFIG"
resolve "$OHIF_CONFIG"

# Preserve the base image's entrypoint. The compose passes the config directory as
# the command (e.g. /etc/orthanc/), which arrives here as "$@".
exec /usr/local/sbin/Orthanc "$@"
