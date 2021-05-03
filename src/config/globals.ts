const EXPORT_URL = String(process.env.NEXT_PUBLIC_ZENDRO_EXPORT_URL ?? '');
const GRAPHQL_URL = String(process.env.NEXT_PUBLIC_ZENDRO_GRAPHQL_URL ?? '');
const METAQUERY_URL = String(
  process.env.NEXT_PUBLIC_ZENDRO_METAQUERY_URL ?? ''
);
const LOGIN_URL = String(process.env.NEXT_PUBLIC_ZENDRO_LOGIN_URL ?? '');
const MAX_RECORD_LIMIT = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT
);
const MAX_UPLOAD_SIZE = Number(process.env.NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE); // size in MB
const REDUX_LOGGER = String(process.env.NEXT_PUBLIC_REDUX_LOGGER ?? '');

interface Config {
  EXPORT_URL: string;
  GRAPHQL_URL: string;
  LOGIN_URL: string;
  MAX_UPLOAD_SIZE: number;
  MAX_RECORD_LIMIT: number;
  METAQUERY_URL: string;
  REDUX_LOGGER: string;
}

const config: Config = {
  EXPORT_URL,
  GRAPHQL_URL,
  LOGIN_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  REDUX_LOGGER,
};

if (
  !GRAPHQL_URL ||
  !LOGIN_URL ||
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
  LOGIN_URL,
  MAX_RECORD_LIMIT,
  MAX_UPLOAD_SIZE,
  METAQUERY_URL,
  REDUX_LOGGER,
};

export default config;
