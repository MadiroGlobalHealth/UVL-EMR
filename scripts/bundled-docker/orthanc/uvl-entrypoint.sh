#!/bin/sh
# Resolve deployment-specific placeholders in the OHIF viewer config, then hand off
# to Orthanc.
#
# Why this exists: Ozone's env-substitution service only rewrites the distro tree it
# bind-mounts from the host, and it does not process .js files at all. app-config.js
# is baked into this image, so nothing else can reach it. This used to be done by
# scripts/src/post-start.sh on the host after start.sh; doing it here means the
# config is correct the moment the container is up, and works identically in a
# pull-only deployment where no distro tree exists.
#
# sed, not envsubst: gettext is not installed in mekomsolutions/orthanc, and
# blanket envsubst would also eat any legitimate $-syntax in the JS.
set -e

OHIF_CONFIG="${OHIF_CONFIG:-/usr/share/orthanc/ohif/app-config.js}"

subst() {
  name="$1"
  value="$2"
  if [ -z "$value" ]; then
    echo "orthanc-entrypoint: WARNING \${$name} is unset; leaving the placeholder" \
         "in $OHIF_CONFIG rather than blanking it" >&2
    return 0
  fi
  sed -i "s|\${$name}|$value|g" "$OHIF_CONFIG"
}

if [ -f "$OHIF_CONFIG" ]; then
  echo "orthanc-entrypoint: resolving OHIF config placeholders in $OHIF_CONFIG"
  subst KEYCLOAK_URL       "$KEYCLOAK_URL"
  subst PACS_PUBLIC_URL    "$PACS_PUBLIC_URL"
  subst OPENMRS_PUBLIC_URL "$OPENMRS_PUBLIC_URL"

  remaining="$(grep -oE '\$\{[A-Z_]+\}' "$OHIF_CONFIG" 2>/dev/null | sort -u | tr '\n' ' ' || true)"
  if [ -n "$remaining" ]; then
    echo "orthanc-entrypoint: WARNING unresolved placeholders remain: $remaining" >&2
  fi
else
  echo "orthanc-entrypoint: $OHIF_CONFIG not present, nothing to substitute"
fi

# Preserve the base image's entrypoint. The compose passes the config directory as
# the command (e.g. /etc/orthanc/), which arrives here as "$@".
exec /usr/local/sbin/Orthanc "$@"
