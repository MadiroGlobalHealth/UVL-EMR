#!/bin/bash -aeu
# FIXTURE - not run in any image. Lines 72-105 of /openmrs/startup-init.sh in
# openmrs/openmrs-core:2.8.9 (md5 36351a4da82cafbf2f01150fc14914ba), verbatim, with
# the two defaults they depend on. Used by test.sh to exercise
# scripts/bundled-docker/openmrs/patch-startup-init.sh against the real upstream
# lines. Refresh it from the image when openmrs.version changes:
#   docker run --rm --entrypoint sh openmrs/openmrs-core:<version> -c 'cat /openmrs/startup-init.sh'
OMRS_HOME=${OMRS_HOME:-'/openmrs'}
OMRS_WEBAPP_NAME=${OMRS_WEBAPP_NAME:-'openmrs'}

# This startup script is responsible for fully preparing the OpenMRS Tomcat environment.
# A volume mount is expected that contains distribution artifacts. The expected format is shown in these environment vars.

OMRS_DISTRO_DIR="$OMRS_HOME/distribution"
OMRS_DISTRO_CORE="$OMRS_DISTRO_DIR/openmrs_core"
OMRS_DISTRO_MODULES="$OMRS_DISTRO_DIR/openmrs_modules"
OMRS_DISTRO_OWAS="$OMRS_DISTRO_DIR/openmrs_owas"
OMRS_DISTRO_CONFIG="$OMRS_DISTRO_DIR/openmrs_config"
OMRS_DISTRO_FRONTEND="$OMRS_DISTRO_DIR/openmrs_spa"

# Each of these mounted directories are used to populate expected configurations on the server, defined here

OMRS_DATA_DIR="$OMRS_HOME/data"
OMRS_MODULES_DIR="$OMRS_DATA_DIR/modules"
OMRS_OWA_DIR="$OMRS_DATA_DIR/owa"
OMRS_CONFIG_DIR="$OMRS_DATA_DIR/configuration"
OMRS_FRONTEND_DIR="$OMRS_DATA_DIR/frontend"

OMRS_SERVER_PROPERTIES_FILE="$OMRS_HOME/$OMRS_WEBAPP_NAME-server.properties"
OMRS_RUNTIME_PROPERTIES_FILE="$OMRS_DATA_DIR/$OMRS_WEBAPP_NAME-runtime.properties"

echo "Deleting modules, OWAs, configuration and frontend from OpenMRS"

rm -fR "${OMRS_MODULES_DIR:?}/*"
rm -fR "${OMRS_OWA_DIR:?}/*"
rm -fR "${OMRS_CONFIG_DIR:?}/*"
rm -fR "${OMRS_FRONTEND_DIR:?}/*"

echo "Loading distribution artifacts into OpenMRS"

[ -d "$OMRS_DISTRO_MODULES" ] && cp -R "$OMRS_DISTRO_MODULES/." "$OMRS_MODULES_DIR"
[ -d "$OMRS_DISTRO_OWAS" ] && cp -R "$OMRS_DISTRO_OWAS/." "$OMRS_OWA_DIR"
[ -d "$OMRS_DISTRO_CONFIG" ] && cp -R "$OMRS_DISTRO_CONFIG/." "$OMRS_CONFIG_DIR"
[ -d "$OMRS_DISTRO_FRONTEND" ] && cp -R "$OMRS_DISTRO_FRONTEND/." "$OMRS_FRONTEND_DIR"
