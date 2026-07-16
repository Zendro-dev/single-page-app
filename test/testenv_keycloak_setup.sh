#!/usr/bin/env bash

set -e

# Load integration test constants
SCRIPT_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
source "${SCRIPT_DIR}/testenv_constants.sh"

printBlockHeader "START" "BOOTSTRAP KEYCLOAK REALM"

# Wait for Keycloak itself to answer before hitting its admin API.
elapsedTime=0
until curl -sf http://localhost:8082/auth/realms/master &>/dev/null
do
  if [ $elapsedTime == $SERVER_CHECK_WAIT_TIME ]; then
    echo -e "${RED}Keycloak${NC} time limit reached"
    exit 1
  fi
  sleep 2
  elapsedTime=$(expr $elapsedTime + 2)
done

node "${SCRIPT_DIR}/testenv_keycloak_bootstrap.js"

printBlockHeader "END" "BOOTSTRAP KEYCLOAK REALM"
