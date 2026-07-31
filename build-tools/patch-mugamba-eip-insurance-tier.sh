#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCH_SRC_DIR="$ROOT_DIR/build-tools/eip-patches/uvl-002/src"
TMP_DIR="${TMPDIR:-/tmp}/uvl-002-eip-build"
ROUTES_DIR="$ROOT_DIR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-odoo-openmrs"
ROUTES_JAR="$ROUTES_DIR/eip-odoo-openmrs-2.2.0.jar"
EIP_CLIENT_JAR="$TMP_DIR/eip-client.jar"
EIP_EXTRACT_DIR="$TMP_DIR/eip-client-extract"
CLASS_OUTPUT_DIR="$TMP_DIR/classes"
BACKUP_JAR="$ROUTES_DIR/eip-odoo-openmrs-2.2.0.jar.bak-20260731"
EIP_CONTAINER="${EIP_CONTAINER:-ozone-uvl-mugamba-eip-odoo-openmrs-1}"

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR" "$CLASS_OUTPUT_DIR"

docker cp "$EIP_CONTAINER:/eip-client/eip-client.jar" "$EIP_CLIENT_JAR"
unzip -q "$EIP_CLIENT_JAR" 'BOOT-INF/classes/*' 'BOOT-INF/lib/*' -d "$EIP_EXTRACT_DIR"

if [[ ! -f "$BACKUP_JAR" ]]; then
  cp "$ROUTES_JAR" "$BACKUP_JAR"
fi

docker run --rm \
  -v "$ROOT_DIR:/workspace" \
  -v "$TMP_DIR:/build" \
  eclipse-temurin:17-jdk \
  sh -lc '
    set -euo pipefail
    javac \
      -cp "/build/eip-client-extract/BOOT-INF/classes:/build/eip-client-extract/BOOT-INF/lib/*:/workspace/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-odoo-openmrs/eip-odoo-openmrs-2.2.0.jar" \
      -d /build/classes \
      $(find /workspace/build-tools/eip-patches/uvl-002/src -name "*.java" | sort)
  '

(
  cd "$CLASS_OUTPUT_DIR"
  zip -qr "$ROUTES_JAR" com
)

docker restart "$EIP_CONTAINER" >/dev/null
echo "Patched $ROUTES_JAR and restarted $EIP_CONTAINER"
