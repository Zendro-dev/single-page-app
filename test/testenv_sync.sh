
#!/usr/bin/env bash

# Exit on error
set -e

# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

# Add patches / copy files etc..

printBlockHeader "START" "APPLY CUSTOM PATCHES"

# Apply test-specific patches to the appropriate graphql server instance
patch -V never \
  "${GRAPHQL_SERVER_1}/validations/country.js" \
  "${TEST_DIR}/config/patches/country.patch"

printBlockHeader "END" "APPLY CUSTOM PATCHES"