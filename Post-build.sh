#!/usr/bin/env bash
set -e

# ─── Paths ───────────────────────────────────────────────────────────────────
UVL_EMR_DIR="$HOME/Developer/UVL-EMR"
EIP_SOURCE_JAR="$HOME/Documents/GitHub/eip-openmrs-orthanc/openmrs-orthanc/target/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar"
EIP_TARGET_DIR="$UVL_EMR_DIR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-openmrs-orthanc"
CONCATENATED_ENV="$UVL_EMR_DIR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/concatenated.env"
ORTHANC_CLIENT_SECRET="zfQBuufpLoIQ4H6adktXAVvOin1nrR6R"

echo "=== Step 1: Remove old stock EIP JAR ==="
rm -f "$EIP_TARGET_DIR"/eip-openmrs-orthanc-*.jar
echo "→ Old JAR removed"

echo ""
echo "=== Step 2: Copy patched EIP JAR ==="
if [ ! -f "$EIP_SOURCE_JAR" ]; then
  echo "ERROR: Patched JAR not found at $EIP_SOURCE_JAR"
  echo "Run: cd ~/Documents/GitHub/eip-openmrs-orthanc/openmrs-orthanc && mvn clean package -DskipTests"
  exit 1
fi
cp "$EIP_SOURCE_JAR" "$EIP_TARGET_DIR/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar"
echo "→ Patched JAR copied: $(ls -lh $EIP_TARGET_DIR/*.jar | awk '{print $5, $9}')"

echo ""
echo "=== Step 3: Add ORTHANC_CLIENT_SECRET to concatenated.env ==="
if grep -q "ORTHANC_CLIENT_SECRET" "$CONCATENATED_ENV"; then
  echo "→ ORTHANC_CLIENT_SECRET already present, skipping"
else
  printf "\nORTHANC_CLIENT_SECRET=%s\n" "$ORTHANC_CLIENT_SECRET" >> "$CONCATENATED_ENV"
  echo "→ ORTHANC_CLIENT_SECRET added"
fi

echo ""
echo "=== Done! Now run: ==="
echo "cd $UVL_EMR_DIR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts"
echo "bash start.sh"