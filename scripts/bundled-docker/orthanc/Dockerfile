# UVL Orthanc (PACS) — Mekom's Orthanc image with the distro's Orthanc config baked in.
#
# Upstream com.ozonehis:bundled-docker ships no Dockerfile for Orthanc, so this one
# is authored here and copied into bundled-docker-tmp by the distro pom.
#
# Derived from mekomsolutions/orthanc rather than orthancteam/orthanc on purpose:
# the LIME deployment drives it with ORTHANC_AUTHENTICATION=keycloak,
# KEYCLOAK_REALM and KEYCLOAK_CLIENT_ID, which are Mekom additions. Rebasing on the
# vendor image would silently drop the Keycloak integration.
#
# Build context is bundled-docker-tmp/ (not .../distro), matching the openmrs,
# frontend and proxy images — that is what lets it reach both distro/ and
# bundled-docker/ in the same build.
FROM mekomsolutions/orthanc:1.0-0.1.0

# The Python plugin, absent from the base image. Without it "PythonScript" in
# orthanc.json is inert: orthancWorklist.py never runs, so nothing populates
# /var/lib/orthanc/worklists and a modality's C-FIND returns no entries.
#
# Debian's build targets Python 3.11, already present here; orthancteam's targets 3.13
# and would drag in that runtime. Reports version 4.0 and loads fine into Orthanc 1.12.6.
#
# --force-confold: orthanc-python depends on Debian's `orthanc`, which ships its own
# /etc/orthanc/orthanc.json; dpkg prompts on the clash and fails on EOF.
# The find: that dependency also drops OLDER duplicates (worklists 1.10.1,
# serve-folders) into /usr/share/orthanc/plugins, which orthanc.json scans too, and two
# versions of one plugin abort Orthanc at startup. -mindepth 1, not -type f: symlinks.
#
# ~26MB. Debian's /usr/sbin/Orthanc is never run; the entrypoint execs
# /usr/local/sbin/Orthanc.
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      -o Dpkg::Options::=--force-confold orthanc-python \
 && find /usr/share/orthanc/plugins -mindepth 1 ! -name 'libOrthancPython.so' -delete \
 && rm -rf /var/lib/apt/lists/*

# Orthanc's configuration directory. The compose passes `command: /etc/orthanc/`
# so these are read instead of the host-mounted secret this image used to rely on.
ADD distro/configs/orthanc/initializer_config/orthanc.json /etc/orthanc/orthanc.json

# Worklist plugin script. Path must match "PythonScript" in orthanc.json, which is
# "/etc/orthanc/orthancWorklist.py".
ADD distro/configs/orthanc/initializer_config/orthancWorklist.py /etc/orthanc/orthancWorklist.py

# OHIF viewer assets served by the OHIF plugin.
ADD distro/configs/orthanc/initializer_config/ohif /usr/share/orthanc/ohif

# The worklists plugin needs this directory to exist and be writable before it will
# accept C-FIND entries; it is absent from the base image. post-start.sh used to
# mkdir/chmod it inside the running container on every start.
# Safe to bake: /var/lib/orthanc/worklists is NOT a volume mount (only
# /var/lib/orthanc/db is), so the image's own filesystem is what Orthanc sees.
RUN mkdir -p /var/lib/orthanc/worklists && chmod 777 /var/lib/orthanc/worklists

# Resolve the OHIF config's deployment-specific URLs at container start, then exec
# the base image's own entrypoint (/usr/local/sbin/Orthanc). env-substitution cannot
# do this: it only rewrites the host-mounted distro tree and skips .js files.
# Expects KEYCLOAK_URL, PACS_PUBLIC_URL and OPENMRS_PUBLIC_URL in the environment —
# the compose files supply them.
COPY bundled-docker/orthanc/uvl-entrypoint.sh /usr/local/bin/uvl-entrypoint.sh
RUN chmod +x /usr/local/bin/uvl-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/uvl-entrypoint.sh"]
