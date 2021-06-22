#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE USER zendro WITH SUPERUSER PASSWORD 'zendro';
	CREATE DATABASE zendro_development OWNER zendro;
	CREATE DATABASE zendro_test OWNER zendro;
	CREATE DATABASE zendro_production OWNER zendro;
EOSQL
