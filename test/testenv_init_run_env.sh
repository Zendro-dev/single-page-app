#!/usr/bin/env bash

set -e

printCloneTaskStart () {
  branch=$1
  name=$2
  echo -e "${GRAY}${SINGLE_SEP}${NC}\n${GREEN}START${NC} ... Cloning ${YELLOW}${branch}${NC} into ${YELLOW}${name}${NC}\n"
}

printCloneTaskEnd () {
  branch=$1
  name=$2
  echo -e "\n${GREEN}END${NC} ... Cloned ${YELLOW}${branch}${NC} into ${YELLOW}${name}${NC}\n${GRAY}${SINGLE_SEP}${NC}"
}

cloneAndInstallGraphqlServerRepository () {

  branch=$1
  outpath=$2
  name=$(basename "$outpath")

  printCloneTaskStart "$branch" "$name"

  # Clone graphql server instance from the upstream remote, using the appropriate branch
  git clone --branch "$branch" https://github.com/Zendro-dev/graphql-server "$outpath"

  # Install node modules
  cd "$outpath"
  # zendro-graphiql is a git submodule (server.js requires it directly) - a
  # plain clone leaves it as an empty directory.
  git submodule update --init --recursive
  NODE_JQ_SKIP_INSTALL_BINARY=true npm install
  # graphql-server's own package.json dropped sequelize-cli as a dependency
  # a while back (see git log -S"sequelize-cli" -- package.json), but
  # migrateDbAndStartServer.sh (this harness's own script, run inside the
  # container) still calls ./node_modules/.bin/sequelize directly. Installed
  # here rather than added back to graphql-server's package.json, since
  # testenv_generate_code.sh later does a `git reset --hard` on this clone
  # anyway (node_modules survives that; a package.json edit wouldn't).
  npm install --no-save sequelize-cli
  cd - &>/dev/null

  printCloneTaskEnd "$branch" "$name"

}

cloneAndInstallRepository () {

  repository=$1
  branch=$2
  outpath=$3
  name=$(basename "$outpath")

  printCloneTaskStart "$branch" "$name"

  # Clone graphql server instance from the upstream remote, using the appropriate branch
  git clone --branch "$branch" "$repository" "$outpath"

  # Install node modules
  cd "$outpath"
  # graphql-server-model-codegen's own package.json pins two @aws-sdk
  # sub-packages with a mutual peer dependency to independent caret ranges
  # (^3.370.0 each) - since there's no lockfile enforcement, a fresh install
  # can land on patch versions that violate that peer constraint (e.g.
  # lib-storage requiring a newer client-s3 than got resolved). Unrelated to
  # this harness; --legacy-peer-deps just accepts npm's chosen resolution
  # instead of hard-failing on it.
  NODE_JQ_SKIP_INSTALL_BINARY=true npm install --legacy-peer-deps
  cd - &>/dev/null

  printCloneTaskEnd "$branch" "$name"

}


# Load integration test constants
SCRIPT_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
source "${SCRIPT_DIR}/testenv_constants.sh"

printBlockHeader "START" "CLONE GRAPHQL SERVER INSTANCES"

# (Re-)Create the environment directory
mkdir -p "$ENV_DIR"

# Install graphql server instances
cloneAndInstallGraphqlServerRepository "$GRAPHQL_SERVER_BRANCH" "$GRAPHQL_SERVER_1"
# cloneAndInstallGraphqlServerRepository "$GRAPHQL_SERVER_BRANCH" "$GRAPHQL_SERVER_2"

# Setup the graphql server code generator
graphql_server_codegen_repository="https://github.com/Zendro-dev/graphql-server-model-codegen.git"
cloneAndInstallRepository "$graphql_server_codegen_repository" "$GRAPHQL_CODEGEN_BRANCH" "$GRAPHQL_CODEGEN_DIR"

printBlockHeader "END" "CLONE GRAPHQL SERVER INSTANCES"
