#!/bin/bash
set -e

sudo rm -rf distro/target
sudo rm -rf countries/burundi/target
sudo rm -rf sites/mugamba/target

mvn clean package --no-transfer-progress "$@"

# Ensure latest jar is in mugamba target (Maven may have cached the old one)
# Copy latest EIP jar from source first, then to target
cp /Users/v.ameil/Developer/eip-openmrs-orthanc-v2/target/eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar \
   /Users/v.ameil/Developer/UVL-EMR/distro/binaries/eip-openmrs-orthanc/
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


echo ""
echo "=== Post-build: Deploy imaging ESM ==="
bash /Users/v.ameil/Developer/UVL-EMR/sites/mugamba/scripts/deploy-imaging-esm.sh \
  "$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT"
echo ""
echo "=== Post-build: Copy orthancWorklist.py ==="
cp /Users/v.ameil/Developer/UVL-EMR/sites/mugamba/configs/orthanc/initializer_config/orthancWorklist.py \
   /Users/v.ameil/Developer/UVL-EMR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/configs/orthanc/initializer_config/orthancWorklist.py
echo "→ orthancWorklist.py copied"

echo "=== Post-build: Fix oauth2.properties for SSO ==="
OAUTH2_PROPS="/Users/v.ameil/Developer/UVL-EMR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/configs/openmrs/properties/oauth2.properties"
if [ -f "$OAUTH2_PROPS" ]; then
  sed -i '' 's|^accessTokenUri=${KEYCLOAK_URL}|accessTokenUri=http://keycloak:8080|' "$OAUTH2_PROPS"
  sed -i '' 's|^userInfoUri=${KEYCLOAK_URL}|userInfoUri=http://keycloak:8080|' "$OAUTH2_PROPS"
  sed -i '' 's|^keysUrl=${KEYCLOAK_URL}|keysUrl=http://keycloak:8080|' "$OAUTH2_PROPS"
  sed -i '' '/^openmrs.mapping.user.provider=provider$/d' "$OAUTH2_PROPS"
  echo "-> oauth2.properties fixed for SSO (server-to-server URLs use internal Docker hostname)"
else
  echo "-> WARNING: oauth2.properties not found - skipping SSO fix"
fi


echo "=== Post-build: Preset oauth2login.started for SSO ==="
OAUTH2_LOGIN_PROPS="/Users/v.ameil/Developer/UVL-EMR/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/distro/configs/openmrs/initializer_config/globalproperties/oauth2-login-props.xml"
if [ -f "$OAUTH2_LOGIN_PROPS" ]; then
  cat > "$OAUTH2_LOGIN_PROPS" << 'PROPSEOF'
<config>
    <globalProperties>
        <globalProperty>
            <property>oauth2login.redirectUriAfterLogin</property>
            <value>/spa/home</value>
        </globalProperty>
        <globalProperty>
            <property>oauth2login.started</property>
            <value>true</value>
        </globalProperty>
    </globalProperties>
</config>
PROPSEOF
  echo "-> oauth2login.started preset to true via Initializer global property"
else
  echo "-> WARNING: oauth2-login-props.xml not found - skipping oauth2login.started preset"
fi

echo "=== Post-build: Create start-uvl.sh wrapper ==="
SCRIPTS_DIR="$(pwd)/sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts"
cat > "$SCRIPTS_DIR/start-uvl.sh" << 'WRAPPER'
#!/bin/bash
# UVL-EMR start wrapper - runs start.sh then post-start.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Starting UVL-EMR ==="
bash "$SCRIPT_DIR/start.sh" "$@"

echo ""
echo "=== Running post-start setup ==="
bash /Users/v.ameil/Developer/UVL-EMR/sites/mugamba/scripts/post-start.sh
WRAPPER
chmod +x "$SCRIPTS_DIR/start-uvl.sh"
echo "→ start-uvl.sh created"
echo "→ Use: bash start-uvl.sh instead of bash start.sh"
