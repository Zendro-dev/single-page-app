#!/usr/bin/env bash

# DIRECTORIES
# TEST_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TEST_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
ROOT_DIR="$(dirname ${TEST_DIR})"
ENV_DIR="${TEST_DIR}/test_env"

GRAPHQL_CODEGEN_BRANCH=master
GRAPHQL_CODEGEN_DIR="${ENV_DIR}/gql_server_codegen"

GRAPHQL_SERVER_BRANCH=master
GRAPHQL_SERVER_1="${ENV_DIR}/gql_science_db_graphql_server1"
# GRAPHQL_SERVER_2="${ENV_DIR}/gql_science_db_graphql_server2"

GRAPHQL_SERVER_1_MODELS="${TEST_DIR}/models/server1"
# GRAPHQL_SERVER_2_MODELS="${TEST_DIR}/config/integration_test_models_instance2"

GRAPHQL_SERVER_1_URL="localhost:3000/graphql"
# GRAPHQL_SERVER_2_URL="localhost:3030/graphql"
SERVER_CHECK_WAIT_TIME=60

SPA_PORT=${PORT:-8080}

#CYPRESS ENV VARIABLES
CYPRESS_BASE_URL=http://localhost:${SPA_PORT}


# TERMINAL OUTPUT
RED='\033[0;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
GRAY='\033[38;5;242m'
NC='\033[0m'

DOUBLE_SEP="=================================================================="
SINGLE_SEP="------------------------------------------------------------------"

# HELPERS
printBlockHeader () {

  tag=$1
  message=$2

  echo ""
  echo -e ${GRAY}${DOUBLE_SEP}${NC}
  echo -e ${YELLOW}${tag} ${GRAY}${message}${NC}
  echo -e ${GRAY}${DOUBLE_SEP}${NC}
  echo ""

}
