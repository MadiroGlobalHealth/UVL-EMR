#!/bin/sh
# Make the OpenMRS entrypoint actually empty /openmrs/data/configuration, modules,
# owa and frontend before it refills them from the image. Run once, at image build time, from the OpenMRS
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
# The same quoted glob wipes modules/, owa/ and frontend/, so an .omod the image no
# longer ships stays beside its replacement and OpenMRS has two versions of one
# module to choose from (#362: ten such files on production, and the stockmanagement
# checksum failure on UAT on 18 Sep). All four lines are replaced the same way.
# This image ships modules and configuration only (Ozone serves the frontend from
# its own container), so owa/ and frontend/ end up empty, which is what upstream
# means them to be. Nothing else under /openmrs/data is touched: the Initializer
# checksums live in configuration_checksums/, a sibling (its own volume on UAT), so
# an unchanged file gets the same checksum and is not reloaded.
#
# The replacement empties the directory rather than removing it (upstream master
# does rm + mkdir): the directory keeps its owner and mode, -xdev keeps it out of
# anything mounted underneath, and a file it cannot delete is reported instead of
# aborting the `bash -e` entrypoint - an EMR that will not start is worse than a
# stale file, and the e2e gate P6 still reports the file. Whether it worked is read
# from the directory being empty afterwards, not from find's status: BSD find
# returns 0 when -delete fails, GNU find does not.
#
# Exits non-zero, failing the image build, when any of the four lines is not there
# in the expected form. That is the point: if upstream reshapes the script, somebody
# has to look, rather than this becoming a silent no-op.
set -eu

target="${1:-/openmrs/startup-init.sh}"

dirs='CONFIG MODULES OWA FRONTEND'

broken() { printf '%s' 'rm -fR "${OMRS_'"$1"'_DIR:?}/*"'; }
fixed() {
  case "$1" in
    CONFIG) issue='305' what='config deleted from the image may still be loaded' ;;
    MODULES) issue='362' what='a module deleted from the image may still be loaded' ;;
    *) issue='362' what='files deleted from the image may still be served' ;;
  esac
  printf '%s' 'mkdir -p "${OMRS_'"$1"'_DIR:?}" && { find "${OMRS_'"$1"'_DIR:?}" -xdev -mindepth 1 -delete; [ -z "$(ls -A "${OMRS_'"$1"'_DIR:?}")" ]; } || echo "WARNING (UVL-EMR#'"$issue"'): could not empty ${OMRS_'"$1"'_DIR}; '"$what"'" >&2'
}
# openmrs-core master, fe4ca8a3
upstream_rm() { printf '%s' 'rm -fR "${OMRS_'"$1"'_DIR:?}"'; }
upstream_mkdir() { printf '%s' 'mkdir "${OMRS_'"$1"'_DIR}"'; }

count() { grep -cxF -- "$1" "$target" || true; }
is_upstream() { [ "$(count "$(upstream_rm "$1")")" = 1 ] && [ "$(count "$(upstream_mkdir "$1")")" = 1 ]; }

[ -f "$target" ] || { echo "patch-startup-init: $target does not exist" >&2; exit 1; }

to_patch=''
upstream=0
for d in $dirs; do
  if [ "$(count "$(broken "$d")")" = 1 ]; then
    to_patch="$to_patch $d"
  elif [ "$(count "$(fixed "$d")")" = 1 ]; then
    echo "patch-startup-init: $target already empties OMRS_${d}_DIR"
  elif is_upstream "$d"; then
    echo "patch-startup-init: $target already deletes OMRS_${d}_DIR (upstream fe4ca8a3); nothing to patch"
    upstream=$((upstream + 1))
  else
    echo "patch-startup-init: $target does not contain the expected OMRS_${d}_DIR wipe:" >&2
    echo "    $(broken "$d")" >&2
    echo "Upstream changed startup-init.sh. Check how it clears OMRS_${d}_DIR now and update this script. Lines mentioning it:" >&2
    grep -n "OMRS_${d}_DIR" "$target" >&2 || true
    exit 1
  fi
done

if [ -n "$to_patch" ]; then
  # A new file in the same directory, then mv: the image user may not own the
  # original, but it can replace it.
  tmp="$(mktemp "$(dirname "$target")/.startup-init.XXXXXX")"
  cat "$target" > "$tmp"
  for d in $to_patch; do
    awk -v broken="$(broken "$d")" -v fixed="$(fixed "$d")" '$0 == broken { print fixed; next } { print }' "$tmp" > "$tmp.next"
    mv "$tmp.next" "$tmp"
  done
  chmod 755 "$tmp"
  mv "$tmp" "$target"
  echo "patch-startup-init: $target now empties$(for d in $to_patch; do printf ' OMRS_%s_DIR' "$d"; done) before copying the distro artifacts"
fi

if [ "$upstream" = 4 ]; then
  echo "patch-startup-init: every wipe in $target is upstream's fe4ca8a3 form - this script and its Dockerfile lines can be retired"
fi

# Whatever path was taken above, prove the result.
for d in $dirs; do
  if [ "$(count "$(broken "$d")")" != 0 ] || { [ "$(count "$(fixed "$d")")" != 1 ] && ! is_upstream "$d"; }; then
    echo "patch-startup-init: $target was not patched as expected for OMRS_${d}_DIR" >&2
    exit 1
  fi
done
bash -n "$target"
