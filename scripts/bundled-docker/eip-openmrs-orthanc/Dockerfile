# UVL EIP OpenMRS<->Orthanc bridge — eip-client with the distro's routes bundle baked in.
#
# Without this image the bridge has no routes: plain mekomsolutions/eip-client starts
# with a single `oauth2` route (observed on Mugamba UAT: "Routes startup (started:1)"),
# so imaging orders placed in OpenMRS never reach Orthanc.
#
# Local dev bind-mounts ${EIP_OPENMRS_ORTHANC_ROUTES_PATH}, which Ozone's utils.sh sets
# to $DISTRO_PATH/binaries/eip-openmrs-orthanc — a path only a host that unpacked the
# distro zip has, hence baking the bundle in for pull-only deployments.
#
# Deliberately mirrors the inherited bundled-docker/eip-odoo-openmrs Dockerfile, which is
# just FROM eip-client plus an ADD into /eip-client/routes. Two things NOT to do here,
# both of which crash-loop the container:
#   * `java -jar` on the bundle — it is a Camel route set, not an executable jar, and
#     gives "Invalid or corrupt jarfile".
#   * overriding ENTRYPOINT at all — the base runs ./start.sh, which does
#     `java -cp eip-client.jar -Dloader.path=routes/ ...` relative to its own WORKDIR, so
#     bundles are extra classpath entries rather than the program. Replacing it broke the
#     classpath and failed on ClassNotFoundException for the logback encoder.
#
# Build context is bundled-docker-tmp/ so distro/... resolves, same as the orthanc,
# orthanc-auth-service, openmrs, frontend and proxy images. The bundle ships inside the
# inherited Ozone artifact; it is not committed to this repo.
#
# 2.3.0 matches eip-odoo-openmrs and the version the bundled stack already ran.
FROM mekomsolutions/eip-client:2.3.0

# Whole directory, not a named jar: the version comes from the Ozone artifact. The
# compose files hardcoded eip-openmrs-orthanc-1.0.0-SNAPSHOT.jar while the artifact
# shipped 0.2.0, so the init container's `cp` failed and the bridge never started.
ADD distro/binaries/eip-openmrs-orthanc/ /eip-client/routes/
