#!/usr/bin/env bash

set -e

isServerReadyForRequests() {

  url="${1}"
  max_time="${2}"

  elapsedTime=0
  until curl "$url" &>/dev/null
  do

    if [ $elapsedTime == $max_time ]; then
      echo "${RED}${url}${NC} time limit reached"
      return 1
    fi

    # Retry every two seconds
    sleep 2
    elapsedTime=$(expr $elapsedTime + 2)
  done

  echo -e ${YELLOW}$url${NC} is ${GREEN}ready${NC}

  return 0

}


# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

printBlockHeader "START" "UP DOCKER CONTAINERS"

# Up detached docker containers
docker compose \
  -f "${TEST_DIR}/config/docker-compose-test.yml" up -d \
  --force-recreate \
  --remove-orphans \
  --renew-anon-volumes


# Wait for the graphql server instances to get ready
echo -e "\nWaiting for GraphQL servers to start ..."

# Async check that the servers are ready to take requests
pids=( )
isServerReadyForRequests "$GRAPHQL_SERVER_1_URL" "$SERVER_CHECK_WAIT_TIME" &
pids+="$! "
# isServerReadyForRequests "$GRAPHQL_SERVER_2_URL" "$SERVER_CHECK_WAIT_TIME" &
# pids+="$! "

# Wait for the check responses
for id in ${pids[@]}; do
  wait $id || exit 0
done

printBlockHeader "END" "UP DOCKER CONTAINERS"
