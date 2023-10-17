#!/usr/bin/env bash

# Exit on error
set -e

# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

printBlockHeader "START" "REMOVE TESTING ENVIRONMENT"

# Remove docker containers, images, and volumes
docker compose -f "${TEST_DIR}/config/docker-compose-test.yml" down -v --rmi all

# Remove testing environment
echo "Removing ${ENV_DIR}"
rm -rf ${ENV_DIR}

kill $(lsof -i:${SPA_PORT} | awk 'FNR==2 {print $2}') || echo "kill: no server running on port ${SPA_PORT}"

printBlockHeader "END" "REMOVE TESTING ENVIRONMENT"
