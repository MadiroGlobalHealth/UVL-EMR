#!/bin/bash
set -e

sudo rm -rf distro/target
sudo rm -rf countries/burundi/target
sudo rm -rf sites/mugamba/target

mvn clean package --no-transfer-progress "$@"

# Ensure latest jar is in mugamba target (Maven may have cached the old one)
cp /Users/v.ameil/Developer/UVL-EMR/distro/binaries/eip-openmrs-orthanc/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar \
   /Users/v.ameil/Developer/UVL-EMR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-openmrs-orthanc/

# ─── Post-build: inject runtime secrets and URLs ──────────────────────────────
CONCATENATED_ENV="$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/concatenated.env"
EIP_TARGET_DIR="$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/binaries/eip-openmrs-orthanc"
ORTHANC_CLIENT_SECRET="zfQBuufpLoIQ4H6adktXAVvOin1nrR6R"

echo ""
echo "=== Verify EIP v2 JAR is present ==="
ls -lh "$EIP_TARGET_DIR"/*.jar
echo "→ OK"

echo ""
echo "=== Post-build: Inject ORTHANC_CLIENT_SECRET ==="
if grep -q "ORTHANC_CLIENT_SECRET" "$CONCATENATED_ENV"; then
  echo "→ Already present, skipping"
else
  printf "\nORTHANC_CLIENT_SECRET=%s\n" "$ORTHANC_CLIENT_SECRET" >> "$CONCATENATED_ENV"
  echo "→ Added"
fi

echo ""
echo "=== Post-build: Inject PACS_PUBLIC_URL ==="
if grep -q "PACS_PUBLIC_URL" "$CONCATENATED_ENV"; then
  echo "→ Already present, skipping"
else
  printf "\nPACS_PUBLIC_URL=http://localhost:8889\n" >> "$CONCATENATED_ENV"
  echo "→ Added"
fi

echo ""
echo "=== Post-build: Inject ORTHANC_PUBLIC_URL ==="
if grep -q "ORTHANC_PUBLIC_URL" "$CONCATENATED_ENV"; then
  echo "→ Already present, skipping"
else
  printf "\nORTHANC_PUBLIC_URL=http://localhost:8889\n" >> "$CONCATENATED_ENV"
  echo "→ Added"
fi

echo ""
echo "=== Build complete! ==="
echo "→ EIP jar: $(ls $EIP_TARGET_DIR/*.jar)"
echo ""
echo "To start:"
echo "  cd $(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts"
echo "  bash start.sh"
# Copy new EIP jar to distro after build
cp /Users/v.ameil/Developer/eip-openmrs-orthanc-v2/target/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar \
   /Users/v.ameil/Developer/UVL-EMR/distro/binaries/eip-openmrs-orthanc/
