#!/bin/sh

# Load environment variables from .env file
source .env

# GitHub repository owner and name
REPO_OWNER="MadiroGlobalHealth"
REPO_NAME="UVL-EMR"

# GitHub API headers
GITHUB_AUTH_HEADER="Authorization: token $GITHUB_AUTH_TOKEN"
GITHUB_REQUEST_TYPE="Accept: application/vnd.github+json"
GITHUB_API_VERSION="X-GitHub-Api-Version: 2022-11-28"

# Fetch the latest run ID
RUN_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs"

# Get the top 1 most recent run ID from the RUN URL
LATEST_RUN_ID=$(curl -s -H "$GITHUB_REQUEST_TYPE" "$RUN_URL" | jq -r '.workflow_runs[0].id')

if [ -z "$LATEST_RUN_ID" ]; then
    echo "Failed to fetch the latest run ID."
    exit 1
fi

echo "Latest run ID: $LATEST_RUN_ID"

# Fetch the artifact download URL
ARTIFACT_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs/$LATEST_RUN_ID/artifacts"
echo $ARTIFACT_URL

# Use jq to find the most recent 'archive_download_url' from the JSON stored in ARTIFACT_URL
ARTIFACT_DOWNLOAD_URL=$(curl -s -H "$GITHUB_REQUEST_TYPE" "$ARTIFACT_URL" | jq -r '.artifacts | sort_by(.created_at) | last | .archive_download_url')
ARTIFACT_DOWNLOAD_NAME=$(curl -s -H "$GITHUB_REQUEST_TYPE" "$ARTIFACT_URL" | jq -r '.artifacts | sort_by(.created_at) | last | .name')

# Print the most recent archive_download_url
echo "$ARTIFACT_DOWNLOAD_URL"

if [ -z "$ARTIFACT_DOWNLOAD_URL" ]; then
    echo "Artifact download URL not found."
    exit 1
fi

echo "Artifact download URL: $ARTIFACT_DOWNLOAD_URL"

# Download the artifact
OUTPUT_ZIP_FILE="latest_artifact.zip"
ARTIFACT_ZIP_FILE="${ARTIFACT_DOWNLOAD_NAME}.zip"

curl -L -o "$OUTPUT_ZIP_FILE" -H "$GITHUB_REQUEST_TYPE" -H "$GITHUB_AUTH_HEADER" -H "$GITHUB_API_VERSION" "$ARTIFACT_DOWNLOAD_URL"

if [ $? -eq 0 ]; then
    echo "Artifact downloaded successfully: $OUTPUT_ZIP_FILE"
else
    echo "Failed to download artifact."
    exit 1
fi

# Extract the downloaded ZIP file
unzip -o "$OUTPUT_ZIP_FILE" -d "./"

if [ $? -eq 0 ]; then
    echo "Artifact extracted successfully."
else
    echo "Failed to extract artifact."
    exit 1
fi

# Extract the artifact ZIP file
unzip -o "$ARTIFACT_ZIP_FILE" -d "./"

if [ $? -eq 0 ]; then
    echo "Artifact extracted successfully."
else
    echo "Failed to extract artifact."
    exit 1
fi

# Clean up and delete OUTPUT_ZIP_FILE and ARTIFACT_ZIP_FILE
rm -f "$OUTPUT_ZIP_FILE" "$ARTIFACT_ZIP_FILE"
echo "Artifact extraction and cleanup completed successfully."

# Restart Ozone from scripts located in folder run/docker/scripts/
cd run/docker/scripts/
./stop-demo.sh
./start-demo.sh