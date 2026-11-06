#!/bin/bash
# Tests scripts/bundled-docker/openmrs/patch-startup-init.sh (#305, #476) against the real
# openmrs-core 2.8.9 lines in startup-init-2.8.9-excerpt.sh. Run by distro/pom.xml in
# every build; also runnable by hand: bash scripts/test/openmrs-startup-init/test.sh
#
# Plain bash 3.2 and BSD/GNU tools only, so it runs the same on macOS and in CI.
set -eu

here="$(cd "$(dirname "$0")" && pwd)"
patcher="$here/../../bundled-docker/openmrs/patch-startup-init.sh"
fixture="$here/startup-init-2.8.9-excerpt.sh"

work="$(mktemp -d "${TMPDIR:-/tmp}/uvl-startup-init-test.XXXXXX")"
trap 'chmod -R u+w "$work" 2>/dev/null; rm -rf "$work"' EXIT

failures=0
pass() { echo "  ok    $1"; }
fail() { echo "  FAIL  $1" >&2; failures=$((failures + 1)); }
check() { if eval "$2"; then pass "$1"; else fail "$1"; fi; }

# An OMRS_HOME whose volume holds what a previous image left behind.
#   omrs_home <dir>
omrs_home() {
  h="$1"
  mkdir -p "$h/distribution/openmrs_config/concepts" \
           "$h/distribution/openmrs_config/liquibase/ozone-uvl-mugamba" \
           "$h/distribution/openmrs_modules" "$h/distribution/openmrs_owas" "$h/distribution/openmrs_spa"
  echo current > "$h/distribution/openmrs_config/concepts/uvl_concepts.csv"
  echo current > "$h/distribution/openmrs_config/liquibase/ozone-uvl-mugamba/liquibase.xml"
  echo m > "$h/distribution/openmrs_modules/a.omod"
  echo patched > "$h/distribution/openmrs_modules/oauth2login-1.5.0-uvl1.omod"

  mkdir -p "$h/data/configuration/concepts" "$h/data/configuration/attributetypes" \
           "$h/data/configuration/liquibase/ozone-uvl-mugamba" \
           "$h/data/configuration/globalproperties/03_uvl-distro" \
           "$h/data/configuration_checksums/concepts" "$h/data/lucene" "$h/data/complex_obs" "$h/data/modules"
  echo old > "$h/data/configuration/concepts/uvl_concepts.csv"
  echo stale > "$h/data/configuration/concepts/uvl_payer.csv"
  echo stale > "$h/data/configuration/attributetypes/visitattributetypes_mugamba.csv"
  echo stale > "$h/data/configuration/liquibase/ozone-uvl-mugamba/uvl-liquibase.xml"
  echo stale > "$h/data/configuration/globalproperties/03_uvl-distro/oauth2-login-props.xml"
  echo stale > "$h/data/configuration/.hidden"
  echo sum > "$h/data/configuration_checksums/concepts/uvl_concepts.checksum"
  echo idx > "$h/data/lucene/index"
  echo obs > "$h/data/complex_obs/1.png"
  # #476: the previous release's build of a module the image now ships under another name
  echo stock > "$h/data/modules/oauth2login-1.5.0.omod"
  echo old > "$h/data/modules/a.omod"
  mkdir -p "$h/data/.openmrs-lib-cache/oauth2login"
  echo cache > "$h/data/.openmrs-lib-cache/oauth2login/config.xml"
}

echo "patch-startup-init.sh"

# 1. The fixture reproduces the defect, or the rest proves nothing.
h="$work/unpatched"; omrs_home "$h"
OMRS_HOME="$h" bash "$fixture" > /dev/null
check "unpatched 2.8.9 keeps a file deleted from the image (the defect)" \
      '[ -f "$h/data/configuration/concepts/uvl_payer.csv" ]'
check "unpatched 2.8.9 keeps a module the image renamed (the #476 defect)" \
      '[ -f "$h/data/modules/oauth2login-1.5.0.omod" ] && [ -f "$h/data/modules/oauth2login-1.5.0-uvl1.omod" ]'

# 2. Patched: configuration/ mirrors the image, nothing beside it is touched.
cp "$fixture" "$work/startup-init.sh"
out="$(sh "$patcher" "$work/startup-init.sh")"
check "patches the 2.8.9 script" '[ "$(grep -c "find \"\${OMRS_CONFIG_DIR:?}\" -xdev -mindepth 1 -delete" "$work/startup-init.sh")" = 1 ]'
check "patches the modules wipe" '[ "$(grep -c "find \"\${OMRS_MODULES_DIR:?}\" -xdev -mindepth 1 -delete" "$work/startup-init.sh")" = 1 ]'
check "leaves the owa/frontend lines as upstream wrote them" \
      '[ "$(diff "$fixture" "$work/startup-init.sh" | grep -c "^[<>]")" = 4 ]'

h="$work/patched"; omrs_home "$h"
status=0; OMRS_HOME="$h" bash "$work/startup-init.sh" > /dev/null 2> "$work/stderr" || status=$?
check "patched script exits 0" '[ "$status" = 0 ]'
check "no warning when everything is removable" '[ ! -s "$work/stderr" ]'
for f in concepts/uvl_payer.csv attributetypes/visitattributetypes_mugamba.csv \
         liquibase/ozone-uvl-mugamba/uvl-liquibase.xml globalproperties/03_uvl-distro .hidden; do
  check "removes stale configuration/$f" '[ ! -e "$h/data/configuration/$f" ]'
done
check "copies the image's config" '[ "$(cat "$h/data/configuration/concepts/uvl_concepts.csv")" = current ]'
check "copies nested image config" '[ -f "$h/data/configuration/liquibase/ozone-uvl-mugamba/liquibase.xml" ]'
check "keeps configuration_checksums/" '[ "$(cat "$h/data/configuration_checksums/concepts/uvl_concepts.checksum")" = sum ]'
check "keeps lucene/ and complex_obs/" '[ -f "$h/data/lucene/index" ] && [ -f "$h/data/complex_obs/1.png" ]'
check "removes the module build the image no longer ships" '[ ! -e "$h/data/modules/oauth2login-1.5.0.omod" ]'
check "modules/ holds exactly the image's omods" \
      '[ "$(ls "$h/data/modules" | tr "\n" " ")" = "a.omod oauth2login-1.5.0-uvl1.omod " ]'
check "copies the image's omod over an old one of the same name" '[ "$(cat "$h/data/modules/a.omod")" = m ]'
check "keeps .openmrs-lib-cache/" '[ -f "$h/data/.openmrs-lib-cache/oauth2login/config.xml" ]'

# 3. A file that cannot be deleted must not stop OpenMRS from starting.
if [ "$(id -u)" != 0 ]; then
  h="$work/locked"; omrs_home "$h"
  chmod 555 "$h/data/configuration/attributetypes"
  status=0; OMRS_HOME="$h" bash "$work/startup-init.sh" > /dev/null 2> "$work/stderr" || status=$?
  check "an undeletable file does not abort startup" '[ "$status" = 0 ]'
  check "an undeletable file is reported" 'grep -q "UVL-EMR#305" "$work/stderr"'
  check "the rest is still mirrored" '[ ! -e "$h/data/configuration/concepts/uvl_payer.csv" ] && [ -f "$h/data/configuration/concepts/uvl_concepts.csv" ]'
  chmod 755 "$h/data/configuration/attributetypes"
else
  echo "  skip  undeletable-file cases (running as root)"
fi

# 4. Idempotent: a non-clean build or a rebuilt layer runs it again.
cp "$work/startup-init.sh" "$work/once.sh"
status=0; sh "$patcher" "$work/startup-init.sh" > /dev/null || status=$?
check "second run succeeds and changes nothing" '[ "$status" = 0 ] && cmp -s "$work/once.sh" "$work/startup-init.sh"'

# 5. Upstream master's fix (fe4ca8a3) needs no patch.
sed -e 's|^rm -fR "${OMRS_CONFIG_DIR:?}/\*"$|rm -fR "${OMRS_CONFIG_DIR:?}"\
mkdir "${OMRS_CONFIG_DIR}"|' \
    -e 's|^rm -fR "${OMRS_MODULES_DIR:?}/\*"$|rm -fR "${OMRS_MODULES_DIR:?}"\
mkdir "${OMRS_MODULES_DIR}"|' "$fixture" > "$work/master.sh"
cp "$work/master.sh" "$work/master-before.sh"
status=0; sh "$patcher" "$work/master.sh" > /dev/null || status=$?
check "accepts upstream master's rm + mkdir unchanged" '[ "$status" = 0 ] && cmp -s "$work/master-before.sh" "$work/master.sh"'

# 6. Anything else fails the image build instead of silently doing nothing.
sed 's|^rm -fR "${OMRS_CONFIG_DIR:?}/\*"$|rm -rf "$OMRS_CONFIG_DIR"/*|' "$fixture" > "$work/other.sh"
status=0; sh "$patcher" "$work/other.sh" > /dev/null 2>&1 || status=$?
check "fails on a reshaped upstream script" '[ "$status" != 0 ]'
sed 's|^rm -fR "${OMRS_MODULES_DIR:?}/\*"$|rm -rf "$OMRS_MODULES_DIR"/*|' "$fixture" > "$work/other-modules.sh"
status=0; sh "$patcher" "$work/other-modules.sh" > /dev/null 2>&1 || status=$?
check "fails on a reshaped upstream modules wipe" '[ "$status" != 0 ]'
status=0; sh "$patcher" "$work/missing.sh" > /dev/null 2>&1 || status=$?
check "fails on a missing script" '[ "$status" != 0 ]'

if [ "$failures" != 0 ]; then
  echo "patch-startup-init.sh: $failures check(s) failed" >&2
  exit 1
fi
echo "patch-startup-init.sh: all checks passed"
