# Create the Orthanc index database on the shared postgresql instance.
#
# Orthanc's PostgreSQL plugin stores its index here — see "PostgreSQL" in
# distro/configs/orthanc/initializer_config/orthanc.json, whose Host is "postgresql".
# Without this the container resolves the host and then fails to open its index.
#
# Run by data/postgresql/create_db.sh, which walks /docker-entrypoint-initdb.d/db/*
# on first initialisation of the postgres data volume. Follows the same shape as the
# odoo/senaite/keycloak/superset scripts alongside it.
export db_name=$ORTHANC_DB_NAME
export db_username=$ORTHANC_DB_USER
export db_password=$ORTHANC_DB_PASSWORD

echo "Creating '$db_username' user and '$db_name' database..."

createuser ${db_username}
createdb ${db_name}

psql -d ${db_name} -c "alter user ${db_username} with password '${db_password}';"
psql -d ${db_name} -c "grant all privileges on database ${db_name} to ${db_username};"
