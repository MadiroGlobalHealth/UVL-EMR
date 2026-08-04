# UVL EIP OpenMRS<->Orthanc bridge — eip-client with the distro's routes jar baked in.
#
# Without this image the bridge has no routes: plain mekomsolutions/eip-client starts
# with a single `oauth2` route (observed on Mugamba UAT: "Routes startup (started:1)"),
# so imaging orders placed in OpenMRS never reach Orthanc.
#
# Local dev bind-mounts ${EIP_OPENMRS_ORTHANC_ROUTES_PATH}, which Ozone's utils.sh sets
# to $DISTRO_PATH/binaries/eip-openmrs-orthanc — a path only a host that unpacked the
# distro zip has, hence baking the jar in for pull-only deployments.
#
# Build context is bundled-docker-tmp/ so distro/... resolves, same as the orthanc,
# orthanc-auth-service, openmrs, frontend and proxy images. The jar ships inside the
# inherited Ozone artifact; it is not committed to this repo.
FROM mekomsolutions/eip-client:2.2.0

# Whole directory, not a named jar: the version comes from the Ozone artifact. The
# compose files hardcoded eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar while the artifact
# shipped 0.2.0, so the init container's `cp` failed and the bridge never started.
ADD distro/binaries/eip-openmrs-orthanc/ /eip-client/routes-jar/

# Resolve at runtime; fail loudly rather than run a bridge that does nothing.
ENTRYPOINT ["/bin/sh", "-c", "\
set -e; \
n=$(ls /eip-client/routes-jar/*.jar 2>/dev/null | wc -l); \
if [ \"$n\" -eq 0 ]; then \
  echo 'eip-openmrs-orthanc: FATAL no routes jar in /eip-client/routes-jar' >&2; exit 1; \
fi; \
if [ \"$n\" -gt 1 ]; then \
  echo 'eip-openmrs-orthanc: FATAL more than one routes jar:' >&2; \
  ls /eip-client/routes-jar/*.jar >&2; exit 1; \
fi; \
jar=$(ls /eip-client/routes-jar/*.jar); \
echo \"eip-openmrs-orthanc: starting $jar\"; \
exec java -jar \"$jar\" \
"]
