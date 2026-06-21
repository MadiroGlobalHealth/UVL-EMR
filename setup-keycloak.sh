#!/bin/bash
set -e

KEYCLOAK_URL="http://localhost:8084"
MAX_WAIT=180
WAITED=0

echo "=== Waiting for Keycloak to be ready ==="
until curl -sf "$KEYCLOAK_URL/realms/ozone" > /dev/null 2>&1; do
  sleep 5
  WAITED=$((WAITED + 5))
  if [ $WAITED -ge $MAX_WAIT ]; then
    echo "Keycloak not ready after ${MAX_WAIT}s"
    exit 1
  fi
  echo "Waiting... (${WAITED}s)"
done
echo "→ Keycloak ready"

echo ""
echo "=== Getting admin token ==="
ADMIN_TOKEN=$(curl -sf -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=admin-cli&username=admin&password=password" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "→ Token obtained"

echo ""
echo "=== Checking orthanc-service client ==="
EXISTS=$(curl -sf -H "Authorization: Bearer $ADMIN_TOKEN" \
  "$KEYCLOAK_URL/admin/realms/ozone/clients?clientId=orthanc-service" \
  | python3 -c "import sys,json; print('yes' if json.load(sys.stdin) else 'no')")

if [ "$EXISTS" = "yes" ]; then
  echo "→ orthanc-service already exists, skipping"
else
  curl -sf -X POST "$KEYCLOAK_URL/admin/realms/ozone/clients" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "clientId": "orthanc-service",
      "enabled": true,
      "clientAuthenticatorType": "client-secret",
      "secret": "zfQBuufpLoIQ4H6adktXAVvOin1nrR6R",
      "serviceAccountsEnabled": true,
      "publicClient": false,
      "standardFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "protocol": "openid-connect"
    }'
  echo "→ orthanc-service client created"
fi

echo ""
echo "=== Done! Keycloak is configured ==="

echo ""
echo "=== Creating admin role and assigning to orthanc-service ==="
curl -sf -X POST "http://localhost:8084/admin/realms/ozone/roles" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"admin"}' 2>/dev/null && echo "→ admin role created" || echo "→ admin role already exists"

ADMIN_ROLE_ID=$(curl -sf -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8084/admin/realms/ozone/roles/admin" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

CLIENT_UUID=$(curl -sf -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8084/admin/realms/ozone/clients?clientId=orthanc-service" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")

SA_USER_ID=$(curl -sf -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8084/admin/realms/ozone/clients/$CLIENT_UUID/service-account-user" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

curl -sf -X POST \
  "http://localhost:8084/admin/realms/ozone/users/$SA_USER_ID/role-mappings/realm" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "[{\"id\":\"$ADMIN_ROLE_ID\",\"name\":\"admin\"}]" && echo "→ admin role assigned to orthanc-service"
