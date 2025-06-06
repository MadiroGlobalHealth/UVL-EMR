#! /bin/bash

set -e

sudo find . -type d -name '__pycache__' -exec sudo rm -r {} +
sudo mvn clean
mvn install
cd sites/mugamba/target/ozone-uvl-mugamba-1.0.0-SNAPSHOT/run/docker/scripts
./start-with-sso.sh
