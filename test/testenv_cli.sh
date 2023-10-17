#!/usr/bin/env bash
#
# - To improve debugging and readability, each command if fully self-contained.
# - Order of execution matters. For option compatibility, please read the manual.

# Exit on error
set -e

# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

# Process command line options
NUM_ARGS=$#
DEFAULT_RUN=true
if [ $# -gt 0 ]; then

  while [[ $NUM_ARGS -gt 0 ]]; do

    key="$1"
    case $key in

        -c|--cleanup)
          OPT_CLEAN_UP=true
          DEFAULT_RUN=false
        ;;

        -g|--generate-code)
          OPT_GEN_CODE=true
          DEFAULT_RUN=false
        ;;

        -h|--help)
          OPT_SHOW_MANUAL=true
          DEFAULT_RUN=false
        ;;

        -k|--keep-running)
          OPT_KEEP_RUNNING=true
        ;;

        -r|--restart-containers)
          OPT_RESTART_DOCKER=true
          DEFAULT_RUN=false
        ;;

        -t|--run-tests-only)
          OPT_RUN_TESTS=true
          DEFAULT_RUN=false
        ;;

        -T|--generate-code-and-run-tests)
          OPT_GENCODE_RUNTESTS=true
          DEFAULT_RUN=false
        ;;

        *)
          echo "Unknown option: $key"
          exit 0
        ;;
    esac

    shift
    let "NUM_ARGS--"

  done

fi


# SHOW MANUAL
# 1. Show the manual page for this command-line interface
if [[ $OPT_SHOW_MANUAL == "true"  ]]; then
  man "${TEST_DIR}/testenv_cli.man"
  exit 0
fi


# PERFORM A FULL CLEAN-UP
# 1. Remove docker containers, images, and volumes
# 2. Remove the testing environment
if [[ $OPT_CLEAN_UP == "true" ]]; then
  bash "${TEST_DIR}/testenv_remove.sh"
  exit 0
fi


# RUN CODE GENERATOR
# 1. Run the code generator and apply patches
if [[ $OPT_GEN_CODE == "true" ]]; then
  bash "${TEST_DIR}/testenv_generate_code.sh"
  bash "${TEST_DIR}/testenv_sync.sh"
  exit 0
fi


# RESTART DOCKER ENVIRONMENT
# 1. Stop docker containers and remove anonymous volumes
# 2. Re-start the docker containers
if [[ $OPT_RESTART_DOCKER == "true" ]]; then
  docker compose -f "${TEST_DIR}/config/docker-compose-test.yml" down -v
  bash "${TEST_DIR}/testenv_docker_up.sh"
  exit 0
fi


# RUN INTEGRATION TESTS
# 1. Run the integration tests
# 2. Perform a full cleanup (optionally disabled)
if [[ $OPT_RUN_TESTS == "true" ]]; then
  yarn cy:run
  # 1. Remove docker containers, images, and volumes
  # 2. Remove the testing environment
  if [[ -z $OPT_KEEP_RUNNING ]]; then
    bash "${TEST_DIR}/testenv_remove.sh"
  fi

  exit 0
fi


# RUN CODE GENERATOR AND INTEGRATION TESTS
# 1. Down docker services and remove anonymous volumes
# 2. Run the code generator and apply patches
# 3. Up the docker services
# 4. Run integration tests
# 5. Perform a full cleanup (optionally disabled)
if [[ $OPT_GENCODE_RUNTESTS == "true" ]]; then
  docker compose -f "${TEST_DIR}/config/docker-compose-test.yml" down -v
  bash "${TEST_DIR}/testenv_generate_code.sh"
  bash "${TEST_DIR}/testenv_sync.sh"
  bash "${TEST_DIR}/testenv_docker_up.sh"
  # yarn build
  # yarn start & wait-on http://localhost:8080
  yarn cy:run

  # 1. Remove docker containers, images, and volumes
  # 2. Remove the testing environment
  if [[ -z $OPT_KEEP_RUNNING ]]; then
    bash "${TEST_DIR}/testenv_remove.sh"
  fi

  exit 0
fi


# PERFORM A COMPLETE RUN
# 1. Perform a full cleanup of any pre-existing environment
# 2. Setup a new testing environment
# 3. Run the code generator and apply patches
# 4. Up the docker services
# 5. Run integration tests
# 6. Perform a full cleanup (optionally disabled)
if [[ $DEFAULT_RUN == "true" ]]; then
  bash "${TEST_DIR}/testenv_remove.sh"
  bash "${TEST_DIR}/testenv_init_run_env.sh"
  bash "${TEST_DIR}/testenv_generate_code.sh"
  bash "${TEST_DIR}/testenv_sync.sh"
  bash "${TEST_DIR}/testenv_docker_up.sh"
  yarn build
  yarn start & wait-on http://localhost:${SPA_PORT}
  yarn cy:run

  # 1. Remove docker containers, images, and volumes
  # 2. Remove the testing environment
  if [[ -z $OPT_KEEP_RUNNING ]]; then
    bash "${TEST_DIR}/testenv_remove.sh"
  fi

  exit 0
fi
