#!/bin/bash
sudo rm -rf distro/target
sudo rm -rf countries/burundi/target
sudo rm -rf sites/mugamba/target
mvn clean package --no-transfer-progress "$@"

# ─── Post-build: deploy patched EIP JAR and inject secrets ───────────────────
EIP_SOURCE_JAR="$HOME/Documents/GitHub/eip-openmrs-orthanc/openmrs-orthanc/target/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar"
EIP_TARGET_DIR="$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-openmrs-orthanc"
CONCATENATED_ENV="$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/concatenated.env"
ORTHANC_CLIENT_SECRET="zfQBuufpLoIQ4H6adktXAVvOin1nrR6R"

echo ""
echo "=== Post-build: Remove old stock EIP JAR ==="
rm -f "$EIP_TARGET_DIR"/eip-openmrs-orthanc-*.jar
echo "→ Old JAR removed"

echo ""
echo "=== Post-build: Copy patched EIP JAR ==="
if [ ! -f "$EIP_SOURCE_JAR" ]; then
  echo "ERROR: Patched JAR not found at $EIP_SOURCE_JAR"
  echo "Run: cd ~/Documents/GitHub/eip-openmrs-orthanc/openmrs-orthanc && mvn clean package -DskipTests"
  exit 1
fi
cp "$EIP_SOURCE_JAR" "$EIP_TARGET_DIR/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar"
echo "→ Patched JAR copied: $(ls -lh $EIP_TARGET_DIR/*.jar | awk '{print $5, $9}')"

echo ""
echo "=== Post-build: Inject ORTHANC_CLIENT_SECRET ==="
if grep -q "ORTHANC_CLIENT_SECRET" "$CONCATENATED_ENV"; then
  echo "→ ORTHANC_CLIENT_SECRET already present, skipping"
else
  printf "\nORTHANC_CLIENT_SECRET=%s\n" "$ORTHANC_CLIENT_SECRET" >> "$CONCATENATED_ENV"
  echo "→ ORTHANC_CLIENT_SECRET added"
fi

echo ""
echo "=== Post-build: Inject PACS_PUBLIC_URL ==="
if grep -q "PACS_PUBLIC_URL" "$CONCATENATED_ENV"; then
  echo "→ PACS_PUBLIC_URL already present, skipping"
else
  printf "\nPACS_PUBLIC_URL=http://localhost:8889\n" >> "$CONCATENATED_ENV"
  echo "→ PACS_PUBLIC_URL added"
fi

echo ""
echo "=== Done! Now run: ==="
echo "cd $(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts"
echo "bash start.sh"