#!/bin/bash
# Deploy imaging ESM to built frontend directory
set -e

TARGET_DIR="$1"
ESM_SRC="/Users/v.ameil/Developer/openmrs-esm-patient-imaging-app/dist"
ESM_DIR="$TARGET_DIR/distro/binaries/openmrs/frontend/zhaosadre-esm-patient-imaging-app-1.0.6"

if [ ! -f "$ESM_SRC/openmrs-esm-patient-imaging-app.js" ]; then
    echo "ESM not built yet, building..."
    cd /Users/v.ameil/Developer/openmrs-esm-patient-imaging-app
    ./node_modules/.bin/webpack --mode production
fi

echo "Deploying imaging ESM to $ESM_DIR"
mkdir -p "$ESM_DIR"
cp -r "$ESM_SRC/"* "$ESM_DIR/"

python3 << PYEOF
import json, os
frontend_dir = "$TARGET_DIR/distro/binaries/openmrs/frontend"
importmap_path = f"{frontend_dir}/importmap.json"
if not os.path.exists(importmap_path):
    print("importmap.json not found, skipping")
    exit(0)
with open(importmap_path) as f:
    d = json.load(f)
d['imports']['@openmrs/esm-patient-imaging-app'] = './zhaosadre-esm-patient-imaging-app-1.0.6/openmrs-esm-patient-imaging-app.js'
with open(importmap_path, 'w') as f:
    json.dump(d, f, indent=2)
routes_path = f"{frontend_dir}/routes.registry.json"
routes_src = f"{frontend_dir}/zhaosadre-esm-patient-imaging-app-1.0.6/routes.json"
if os.path.exists(routes_path) and os.path.exists(routes_src):
    with open(routes_path) as f:
        r = json.load(f)
    with open(routes_src) as f:
        routes = json.load(f)
    r['@openmrs/esm-patient-imaging-app'] = routes
    with open(routes_path, 'w') as f:
        json.dump(r, f, indent=2)
print("Imaging ESM deployed successfully")
PYEOF
