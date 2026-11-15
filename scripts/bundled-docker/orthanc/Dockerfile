# UVL Orthanc (PACS) — the vendor Orthanc image with the distro's Orthanc config baked in.
#
# Upstream com.ozonehis:bundled-docker ships no Dockerfile for Orthanc, so this one
# is authored here and copied into bundled-docker-tmp by the distro pom.
#
# Build context is bundled-docker-tmp/ (not .../distro), matching the openmrs,
# frontend and proxy images — that is what lets it reach both distro/ and
# bundled-docker/ in the same build.
#
# orthancteam/orthanc, NOT mekomsolutions/orthanc. Two reasons:
#
#   1. Mekom's image has not published a tag since Feb 2025, and its plugin set is
#      frozen there: OrthancExplorer2 1.7.0, authorization 0.9.x, and the LEGACY
#      ModalityWorklists plugin. OE2 only grows a Worklists menu at 1.10.1, backed by
#      the rewritten worklists plugin and authorization >= 0.10.3 (which is where the
#      "worklists" permission the site permissions.json already asks for comes from).
#      On 1.7.0 that menu does not exist at any permission level — measured: the whole
#      OE2 bundle contains no "worklist" string and its only routes are /,
#      /filtered-studies, /settings, /settings-labels, /settings-permissions. This is
#      the single reason the Worklist section never appeared on UAT.
#
#   2. The comment this replaces said Mekom was required for ORTHANC_AUTHENTICATION /
#      KEYCLOAK_REALM / KEYCLOAK_CLIENT_ID. Those variables are inert here — this
#      image's entrypoint never reads them, and authentication is delegated to
#      orthanc-auth-service through orthanc.json's "Authorization" block. The compose
#      files stopped passing them some time ago.
#
# Verified against 26.7.0 before switching, by booting it on the UAT docker network
# with the live orthanc.json and the live orthanc-auth-service: OE2 1.14.1,
# authorization (with the get/post/put/delete ^/worklists patterns), orthanc-worklists
# 0.9.2, ohif 1.8, stone-webviewer, dicom-web 1.23 and python 7.1 all register; the
# existing Keycloak block is accepted unchanged; a service token minted from the real
# Keycloak returns 200 on /studies (the EIP bridge's call); and a .wl file written by
# orthancWorklist.py on 2026-08-09 was listed verbatim by GET /worklists — the tags the
# Worklists page renders. So the bridge, the payment gate and the C-FIND leg are
# untouched by this: the new plugin still reads the same folder of .wl files.
# -full, not the plain tag: only the -full variant ships libOrthancJava.so and a JVM, and the
# Orthanc FHIR server is a Java plugin. Without it, JAVA_PLUGIN_ENABLED is inert and the FHIR
# endpoints never exist. Verified: `ls plugins-available | grep java` is empty on 26.7.0 and
# returns libOrthancJava.so on 26.7.0-full.
FROM orthancteam/orthanc:26.7.0-full

# NOTE: no apt-get install of Debian's orthanc-python here any more. That existed only
# because Mekom's image shipped no Python plugin, and it dragged in Debian's `orthanc`
# package, which littered /usr/share/orthanc/plugins with older duplicate plugins and
# /etc/orthanc with competing config sections — both of which crash-looped Orthanc and
# had to be cleaned up in the same layer. orthancteam ships libOrthancPython.so itself
# (plugin version 7.1), and enables it automatically because "PythonScript" is set in
# the config below, so the whole workaround and its cleanups are gone.

# Orthanc's configuration directory. The vendor entrypoint merges every
# /etc/orthanc/*.json into the config it generates, so this file is picked up with no
# `command:` override in the compose file.
ADD distro/configs/orthanc/initializer_config/orthanc.json /etc/orthanc/orthanc.json

# Worklist plugin script. Path must match "PythonScript" in orthanc.json, which is
# "/etc/orthanc/orthancWorklist.py".
ADD distro/configs/orthanc/initializer_config/orthancWorklist.py /etc/orthanc/orthancWorklist.py

# OHIF viewer assets served by the OHIF plugin.
ADD distro/configs/orthanc/initializer_config/ohif /usr/share/orthanc/ohif

# Orthanc FHIR server — a Java plugin, run by libOrthancJava.so from the -full base above.
# Exposes Orthanc's content at /fhir as FHIR Patient, ImagingStudy and Endpoint resources, which
# is what lets OpenMRS address imaging as FHIR rather than through DICOM-specific REST.
#
# Upstream binary, downloaded from
# https://orthanc.uclouvain.be/downloads/cross-platform/orthanc-java/2.0/OrthancFHIR.jar
# and vendored here so the image builds without network access to that host. It bundles HAPI FHIR
# and its dependencies, hence ~40MB.
#
# Only Patient, ImagingStudy and Endpoint are implemented upstream — there is no Task or
# ServiceRequest provider, so those cannot be mapped through this route however it is configured.
ADD distro/configs/orthanc/initializer_config/java /usr/share/orthanc/java

# The worklists plugin needs this directory to exist and be writable before it will
# accept C-FIND entries; it is absent from the base image. post-start.sh used to
# mkdir/chmod it inside the running container on every start. Baking it also seeds the
# permissions of the `orthanc-worklists` named volume the compose file mounts here.
RUN mkdir -p /var/lib/orthanc/worklists && chmod 777 /var/lib/orthanc/worklists

# Resolve the OHIF config's deployment-specific URLs at container start, then exec
# the base image's own entrypoint (/docker-entrypoint.sh). env-substitution cannot
# do this: it only rewrites the host-mounted distro tree and skips .js files.
# Expects KEYCLOAK_URL, PACS_PUBLIC_URL and OPENMRS_PUBLIC_URL in the environment —
# the compose files supply them.
COPY bundled-docker/orthanc/uvl-entrypoint.sh /usr/local/bin/uvl-entrypoint.sh
RUN chmod +x /usr/local/bin/uvl-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/uvl-entrypoint.sh"]

# Restated deliberately. Declaring ENTRYPOINT resets any CMD inherited from the base
# image, so without this the base entrypoint is reached with no arguments and exits
# immediately: "FATAL ERROR: docker-entrypoint.sh expects a single parameter: the path
# to the configuration file(s)". Measured — the container never starts.
#
# /tmp/orthanc.json is the base image's own default and is the file it GENERATES, by
# merging /etc/orthanc/*.json, the environment and the docker secrets. It is not our
# config; ours is the input at /etc/orthanc/orthanc.json.
CMD ["/tmp/orthanc.json"]
