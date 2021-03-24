#!/usr/bin/env bash

# Exit on error
set -e

printCodegenTaskStart () {
  path=$1
  name=$(basename $path)
  echo -e "${GRAY}${SINGLE_SEP}${NC}\n${GREEN}START${NC} ... Generating code in ${YELLOW}${name}${NC}\n"
}

printCodegenTaskEnd () {
  path=$1
  name=$(basename $path)
  echo -e "\n${GREEN}END${NC} ... Generated code in ${YELLOW}${name}${NC}\n${GRAY}${SINGLE_SEP}${NC}"
}

generateGraphqlServerCode () {

  echo ${ROOT_DIR}
  models=$1
  output=$2
  branch=$3

  printCodegenTaskStart $output

  # Restore the graphql server repository to a clean state
  cd $output
  echo node_modules > .gitignore
  git clean -fd &>/dev/null
  git reset --hard origin/${branch} &>/dev/null
  cd - &>/dev/null

  # Run the code generator
  # node "${ROOT_DIR}/index.js" -f "$models" --migrations -o $output
  node "${GRAPHQL_CODEGEN_DIR}/index.js" -f "$models" --migrations -o $output

  printCodegenTaskEnd $output
}


# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

printBlockHeader "START" "RUN GRAPHQL SERVER CODE GENERATOR"

# Run the code generator over each of the graphql server instances
generateGraphqlServerCode "$GRAPHQL_SERVER_1_MODELS" "$GRAPHQL_SERVER_1" "$GRAPHQL_SERVER_BRANCH"
# generateGraphqlServerCode "$GRAPHQL_SERVER_2_MODELS" "$GRAPHQL_SERVER_2" "$GRAPHQL_SERVER_BRANCH"

printBlockHeader "END" "RUN GRAPHQL SERVER CODE GENERATOR"
