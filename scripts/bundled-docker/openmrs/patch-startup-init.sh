#!/bin/sh
# Make the OpenMRS entrypoint actually empty /openmrs/data/configuration and
# /openmrs/data/modules before it refills them from the image. Run once, at image
# build time, from the OpenMRS Dockerfile (distro/pom.xml, bundled-docker profile).
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
# The modules line has the same defect (#476): an omod whose filename changes
# between releases is added beside the old one, never replacing it. Shipping
# oauth2login-1.5.0-uvl1.omod left the stock oauth2login-1.5.0.omod in the volume,
# and OpenMRS loaded the stock one. Two builds of one module id in modules/ are not
# a version conflict OpenMRS resolves; whichever it reads last wins.
#
# Only the configuration and modules lines are replaced. owa/ and frontend/ keep
# upstream behaviour, and nothing else under /openmrs/data is touched: the
# Initializer checksums live in configuration_checksums/, a sibling (its own volume
# on UAT), so an unchanged file gets the same checksum and is not reloaded; the
# exploded module cache .openmrs-lib-cache/ is OpenMRS's own and is left alone.
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

[ -f "$target" ] || { echo "patch-startup-init: $target does not exist" >&2; exit 1; }

count() { grep -cxF -- "$1" "$target" || true; }

# patch_wipe <VAR> <issue> <what is left behind if it fails>
# Replaces upstream's no-op `rm -fR "${VAR:?}/*"` with a wipe that works.
patch_wipe() {
  var="$1"; issue="$2"; consequence="$3"
  broken="rm -fR \"\${$var:?}/*\""
  fixed="mkdir -p \"\${$var:?}\" && { find \"\${$var:?}\" -xdev -mindepth 1 -delete; [ -z \"\$(ls -A \"\${$var:?}\")\" ]; } || echo \"WARNING ($issue): could not empty \${$var}; $consequence\" >&2"
  # openmrs-core master, fe4ca8a3
  upstream_rm="rm -fR \"\${$var:?}\""
  upstream_mkdir="mkdir \"\${$var}\""

  if [ "$(count "$broken")" = 1 ]; then
    # A new file in the same directory, then mv: the image user may not own the
    # original, but it can replace it.
    tmp="$(mktemp "$(dirname "$target")/.startup-init.XXXXXX")"
    awk -v broken="$broken" -v fixed="$fixed" '$0 == broken { print fixed; next } { print }' "$target" > "$tmp"
    chmod 755 "$tmp"
    mv "$tmp" "$target"
    echo "patch-startup-init: $target now empties $var before copying the distro"
  elif [ "$(count "$fixed")" = 1 ]; then
    echo "patch-startup-init: $target is already patched for $var"
  elif [ "$(count "$upstream_rm")" = 1 ] && [ "$(count "$upstream_mkdir")" = 1 ]; then
    echo "patch-startup-init: $target already deletes $var (upstream fe4ca8a3); nothing to patch - its part of this script can be retired"
    return 0
  else
    echo "patch-startup-init: $target does not contain the expected $var wipe:" >&2
    echo "    $broken" >&2
    echo "Upstream changed startup-init.sh. Check how it clears $var now and update this script. Lines mentioning it:" >&2
    grep -n "$var" "$target" >&2 || true
    exit 1
  fi

  # Whatever path was taken above, prove the result.
  if [ "$(count "$broken")" != 0 ] || [ "$(count "$fixed")" != 1 ]; then
    echo "patch-startup-init: $target was not patched as expected for $var" >&2
    exit 1
  fi
}

patch_wipe OMRS_CONFIG_DIR UVL-EMR#305 "config deleted from the image may still be loaded"
patch_wipe OMRS_MODULES_DIR UVL-EMR#476 "a module renamed or removed in the image may still be loaded"

bash -n "$target"
