#!/usr/bin/env bash

# Wait until the relational database-server up and running
waited=0
until node ./scripts/testDatabaseConnectionsAvailable.js 1>/dev/null
do
  if [ $waited == 240 ]; then
    echo -e '\nERROR: Time out reached while waiting for relational database server to be available.\n'
    exit 1
  fi
  sleep 2
  waited=$(expr $waited + 2)
done


# Run all generated migrations, SQL and Cassandra alike - each migration
# file is storage-type aware (see e.g. a cassandra-backed model's generated
# migration vs. a sql-backed one) and expects to be called with a fully
# initialized zendro object (zendro.models.<model>.storageHandler etc.), not
# a raw sequelize-cli QueryInterface. migrateDb.js/utils/migration.js (both
# shipped by graphql-server itself) is the current, unified entrypoint for
# that - graphql-server-model-codegen no longer generates sequelize-cli
# compatible migrations, doesn't nest them under a per-storage-key
# subfolder, and this repo no longer ships a separate cassandra setup
# script the way it used to.
if ! node ./migrateDb.js up; then
  echo -e '\nERROR: Migrating the database(s) caused an error.\n'
  exit 1
fi

# Start GraphQL-server
npm start # acl
