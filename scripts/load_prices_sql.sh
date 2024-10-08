# Run SQL file to add prices after the server is up #########################################
DB_CONTAINER_NAME="ozone-uvl-distro-openmrs-1"
DB_HOST="ozone-uvl-distro-mysql-1"
DB_USER="root"
DB_PASSWORD="3cY8Kve4lGey"
DB_NAME="openmrs"
SQL_FILE_PATH="./item_prices.sql"
CONTAINER_SQL_FILE_PATH="/openmrs/item_prices.sql"


# Wait for the OpenMRS container to be healthy
echo "Waiting for OpenMRS container ($DB_CONTAINER_NAME) to be healthy..."
until docker inspect --format='{{.State.Health.Status}}' "$DB_CONTAINER_NAME" | grep -q "healthy"; do
    echo "Waiting for $DB_CONTAINER_NAME to become healthy..."
    sleep $CHECK_INTERVAL
done
echo "$DB_CONTAINER_NAME is healthy."

# # Wait for OpenMRS to fully load and display the login page
# echo "Waiting for OpenMRS login page to be available..."
# until curl -s -o /dev/null -w "%{http_code}" "$OPENMRS_URL" | grep -q "200"; do
#     echo "Waiting for OpenMRS server to fully start and load the login page..."
#     sleep $CHECK_INTERVAL
# done

# echo "OpenMRS login page is available at $OPENMRS_URL."

echo "MySQL is up - executing SQL script"

# Execute SQL commands from the file inside the MySQL container
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$CONTAINER_SQL_FILE_PATH"

echo "SQL commands executed successfully."