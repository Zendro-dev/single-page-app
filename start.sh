#/usr/bin/env bash

export PORT=8081
export REACT_APP_ZENDRO_MAX_RECORD_LIMIT=100
export REACT_APP_ZENDRO_GRAPHQL_SERVER_URL=http://localhost:3000/graphql
export REACT_APP_ZENDRO_LOGIN_URL=http://localhost:3000/login
export REACT_APP_ZENDRO_EXPORT_URL=http://localhost:3000/export
export REACT_APP_ZENDRO_MAX_UPLOAD_SIZE=500

yarn start
