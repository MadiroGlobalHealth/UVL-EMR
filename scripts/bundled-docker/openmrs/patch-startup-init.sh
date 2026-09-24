#!/bin/sh
# Make the OpenMRS entrypoint actually empty /openmrs/data/configuration before it
# refills it from the image. Run once, at image build time, from the OpenMRS
# Dockerfile (distro/pom.xml, bundled-docker profile).
#
# Why this exists (#305): openmrs-core's startup-init.sh, up to and including 2.8.9,
# does
#
#     rm -fR "${OMRS_CONFIG_DIR:?}/*"
#
# with the glob inside the quotes. It deletes a file literally named '*', i.e.
# nothing, and the cp that follows only adds and overwrites. So a config file
# deleted or renamed in the repo stays in the openmrs-data volume for ever and the
# Initializer keeps loading it, with no source in git. On Mugamba UAT this has
# stranded an old OCL lab-test collection beside the current one, a flat copy of
# every file a layout change moved, and after #233 a 42 KB uvl-liquibase.xml.
# openmrs-core fixed it on master (fe4ca8a3, 2026-01-09) but not on the 2.8.x line.
#
# Only the configuration line is replaced. modules/, owa/ and frontend/ keep
# upstream behaviour, and nothing else under /openmrs/data is touched: the
# Initializer checksums live in configuration_checksums/, a sibling (its own volume
# on UAT), so an unchanged file gets the same checksum and is not reloaded.
#
# The replacement empties the directory rather than removing it (upstream master
# does rm + mkdir): the directory keeps its owner and mode, -xdev keeps it out of
# anything mounted underneath, and a file it cannot delete is reported instead of
# aborting the `bash -e` entrypoint - an EMR that will not start is worse than a
# stale file, and the e2e gate P6 still reports the file. Whether it worked is read
# from the directory being empty afterwards, not from find's status: BSD find
# returns 0 when -delete fails, GNU find does not.
#
# Exits non-zero, failing the image build, when the line to patch is not there in
# the expected form. That is the point: if upstream reshapes the script, somebody
# has to look, rather than this becoming a silent no-op.
set -eu

target="${1:-/openmrs/startup-init.sh}"

broken='rm -fR "${OMRS_CONFIG_DIR:?}/*"'
fixed='mkdir -p "${OMRS_CONFIG_DIR:?}" && { find "${OMRS_CONFIG_DIR:?}" -xdev -mindepth 1 -delete; [ -z "$(ls -A "${OMRS_CONFIG_DIR:?}")" ]; } || echo "WARNING (UVL-EMR#305): could not empty ${OMRS_CONFIG_DIR}; config deleted from the image may still be loaded" >&2'
# openmrs-core master, fe4ca8a3
upstream_rm='rm -fR "${OMRS_CONFIG_DIR:?}"'
upstream_mkdir='mkdir "${OMRS_CONFIG_DIR}"'

count() { grep -cxF -- "$1" "$target" || true; }

[ -f "$target" ] || { echo "patch-startup-init: $target does not exist" >&2; exit 1; }

if [ "$(count "$broken")" = 1 ]; then
  # A new file in the same directory, then mv: the image user may not own the
  # original, but it can replace it.
  tmp="$(mktemp "$(dirname "$target")/.startup-init.XXXXXX")"
  awk -v broken="$broken" -v fixed="$fixed" '$0 == broken { print fixed; next } { print }' "$target" > "$tmp"
  chmod 755 "$tmp"
  mv "$tmp" "$target"
  echo "patch-startup-init: $target now empties OMRS_CONFIG_DIR before copying the distro config"
elif [ "$(count "$fixed")" = 1 ]; then
  echo "patch-startup-init: $target is already patched"
elif [ "$(count "$upstream_rm")" = 1 ] && [ "$(count "$upstream_mkdir")" = 1 ]; then
  echo "patch-startup-init: $target already deletes OMRS_CONFIG_DIR (upstream fe4ca8a3); nothing to patch - this script and its Dockerfile lines can be retired"
  exit 0
else
  echo "patch-startup-init: $target does not contain the expected configuration wipe:" >&2
  echo "    $broken" >&2
  echo "Upstream changed startup-init.sh. Check how it clears OMRS_CONFIG_DIR now and update this script. Lines mentioning it:" >&2
  grep -n 'OMRS_CONFIG_DIR' "$target" >&2 || true
  exit 1
fi

# Whatever path was taken above, prove the result.
if [ "$(count "$broken")" != 0 ] || [ "$(count "$fixed")" != 1 ]; then
  echo "patch-startup-init: $target was not patched as expected" >&2
  exit 1
fi
bash -n "$target"
