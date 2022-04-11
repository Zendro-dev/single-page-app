const EXPORT_URL = String(process.env.NEXT_PUBLIC_ZENDRO_EXPORT_URL ?? '');
const GRAPHQL_URL = String(process.env.NEXT_PUBLIC_ZENDRO_GRAPHQL_URL ?? '');
const METAQUERY_URL = String(
  process.env.NEXT_PUBLIC_ZENDRO_METAQUERY_URL ?? ''
);
const ROLES_URL = String(process.env.NEXT_PUBLIC_ZENDRO_ROLES_URL ?? '');
const MAX_RECORD_LIMIT = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT
);
const MAX_UPLOAD_SIZE = Number(process.env.NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE); // size in MB
const REDUX_LOGGER = String(process.env.NEXT_PUBLIC_REDUX_LOGGER ?? '');
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 20);
const RECORD_DELIMITER = process.env.RECORD_DELIMITER || '\n';
const FIELD_DELIMITER = process.env.FIELD_DELIMITER || ',';
const ARRAY_DELIMITER = process.env.ARRAY_DELIMITER || ';';
const SHEET_NAME = process.env.SHEET_NAME || '';
interface Config {
  EXPORT_URL: string;
  GRAPHQL_URL: string;
  ROLES_URL: string;
  MAX_UPLOAD_SIZE: number;
  MAX_RECORD_LIMIT: number;
  METAQUERY_URL: string;
  REDUX_LOGGER: string;
  BATCH_SIZE: number;
  RECORD_DELIMITER: string;
  FIELD_DELIMITER: string;
  ARRAY_DELIMITER: string;
  SHEET_NAME: string;
}

const config: Config = {
  EXPORT_URL,
  GRAPHQL_URL,
  ROLES_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  REDUX_LOGGER,
  BATCH_SIZE,
  RECORD_DELIMITER,
  FIELD_DELIMITER,
  ARRAY_DELIMITER,
  SHEET_NAME,
};

if (
  !GRAPHQL_URL ||
  !ROLES_URL ||
  !EXPORT_URL ||
  !MAX_UPLOAD_SIZE ||
  !MAX_RECORD_LIMIT ||
  !METAQUERY_URL
) {
  console.error(JSON.stringify(config, null, 2));
  throw new Error('Some mandatory variables in `env.local` are not being set');
}

export {
  EXPORT_URL,
  GRAPHQL_URL,
  ROLES_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  REDUX_LOGGER,
  BATCH_SIZE,
  RECORD_DELIMITER,
  FIELD_DELIMITER,
  ARRAY_DELIMITER,
  SHEET_NAME,
};

export default config;
