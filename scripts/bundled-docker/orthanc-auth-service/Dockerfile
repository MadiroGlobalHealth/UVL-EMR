# UVL Orthanc auth service — issues the patient-scoped viewer tokens that let the
# Stone/OHIF viewers open a study without exposing Orthanc directly.
#
# Exists as a site image purely to bake in permissions.json: the local stack
# bind-mounts it from ${ORTHANC_CONFIG_PATH}/../permissions.json, which a pull-only
# deployment has no way to provide.
#
# Build context is bundled-docker-tmp/ so distro/... resolves, same as the orthanc,
# openmrs, frontend and proxy images.
#
# Pinned to a release rather than :latest. NOTE this base image is published for
# linux/amd64 ONLY — every orthancteam/orthanc-auth-service tag is amd64 — so the
# image entry in sites/mugamba/pom.xml deliberately does not request arm64, and the
# compose keeps `platform: linux/amd64` for this service.
FROM orthancteam/orthanc-auth-service:26.4.1

# Path must match PERMISSIONS_FILE_PATH in the compose files.
ADD distro/configs/orthanc/permissions.json /orthanc-auth-service/permissions.json
