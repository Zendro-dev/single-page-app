// Ported from single-page-app/src/config/globals.ts, trimmed:
//   - GRAPHQL_URL/METAQUERY_URL are no longer configurable - they're always
//     same-origin relative paths, proxied to graphql-server by
//     hooks.server.ts (dev)/server.js (prod), same as /auth/*. There's no
//     separate origin to point at anymore.
//   - ROLES_URL is gone - permissions come from AuthProvider's
//     /auth/permissions call now, not a client-decoded JWT.
//   - BASEPATH is gone - unused by anything ported so far; a subpath
//     deployment would use Vite's own `base` config + react-router's
//     `basename` instead, not manual href prefixing.
//   - REDUX_LOGGER was already dead code upstream (no Redux in this app).
// Next's build-time NEXT_PUBLIC_* vars -> Vite's import.meta.env.VITE_*.
const GRAPHQL_URL = '/graphql';
const METAQUERY_URL = '/meta_query';
const MAX_RECORD_LIMIT = Number(import.meta.env.VITE_ZENDRO_MAX_RECORD_LIMIT ?? 10000);
const MAX_UPLOAD_SIZE = Number(import.meta.env.VITE_ZENDRO_MAX_UPLOAD_SIZE ?? 500); // size in MB
const RECORD_DELIMITER = import.meta.env.VITE_RECORD_DELIMITER || '\n';
const FIELD_DELIMITER = import.meta.env.VITE_FIELD_DELIMITER || ',';
const ARRAY_DELIMITER = import.meta.env.VITE_ARRAY_DELIMITER || ';';
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || '';

interface Config {
  GRAPHQL_URL: string;
  MAX_UPLOAD_SIZE: number;
  MAX_RECORD_LIMIT: number;
  METAQUERY_URL: string;
  RECORD_DELIMITER: string;
  FIELD_DELIMITER: string;
  ARRAY_DELIMITER: string;
  SHEET_NAME: string;
}

const config: Config = {
  GRAPHQL_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  RECORD_DELIMITER,
  FIELD_DELIMITER,
  ARRAY_DELIMITER,
  SHEET_NAME,
};

export {
  GRAPHQL_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  RECORD_DELIMITER,
  FIELD_DELIMITER,
  ARRAY_DELIMITER,
  SHEET_NAME,
};

export default config;
