export const GRAPHQL_URL = process.env.NEXT_PUBLIC_ZENDRO_GRAPHQL_URL;
export const LOGIN_URL = process.env.NEXT_PUBLIC_ZENDRO_LOGIN_URL;
export const EXPORT_URL = process.env.NEXT_PUBLIC_ZENDRO_EXPORT_URL;
export const MAX_UPLOAD_SIZE = process.env.NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE; // size in MB
export const MAX_RECORD_LIMIT = process.env.NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT;
export const REDUX_LOGGER = process.env.NEXT_PUBLIC_REDUX_LOGGER;

const config = {
  GRAPHQL_URL,
  LOGIN_URL,
  EXPORT_URL,
  MAX_UPLOAD_SIZE: Number(MAX_UPLOAD_SIZE),
  MAX_RECORD_LIMIT: Number(MAX_RECORD_LIMIT),
  REDUX_LOGGER,
};

if (
  !GRAPHQL_URL ||
  !LOGIN_URL ||
  !EXPORT_URL ||
  !MAX_UPLOAD_SIZE ||
  !MAX_RECORD_LIMIT
) {
  console.error(JSON.stringify(config, null, 2));
  throw new Error('Some mandatory variables in `env.local` are not being set');
}

export default config;
