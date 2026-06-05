#!/bin/bash
sudo rm -rf distro/target
sudo rm -rf countries/burundi/target
sudo rm -rf sites/mugamba/target
mvn clean package --no-transfer-progress "$@"
