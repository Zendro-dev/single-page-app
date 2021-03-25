#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE USER sciencedb WITH SUPERUSER PASSWORD 'sciencedb';
	CREATE DATABASE sciencedb_development OWNER sciencedb;
	CREATE DATABASE sciencedb_test OWNER sciencedb;
	CREATE DATABASE sciencedb_production OWNER sciencedb;
EOSQL
