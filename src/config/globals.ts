export const PORT = Number(process.env.NEXT_PUBLIC_PORT);
export const GRAPHQL_SERVER_URL =
  process.env.NEXT_PUBLIC_ZENDRO_GRAPHQL_SERVER_URL ??
  process.env.NEXT_PUBLIC_ZENDRO_API_URL;
export const LOGIN_URL = process.env.NEXT_PUBLIC_ZENDRO_LOGIN_URL;
export const EXPORT_URL = process.env.NEXT_PUBLIC_ZENDRO_EXPORT_URL;
export const MAX_UPLOAD_SIZE = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE
); // size in MB
export const MAX_RECORD_LIMIT = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT
);
export const REQUEST_LOGGER =
  process.env.NEXT_PUBLIC_REQUEST_LOGGER === 'true' ? true : false; // TODO: review this statement
export const MAX_DYNAMIC_IMPORT_RETRIES = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_DYNAMIC_IMPORT_RETRIES
);

const config = {
  PORT,
  GRAPHQL_SERVER_URL,
  LOGIN_URL,
  EXPORT_URL,
  MAX_UPLOAD_SIZE,
  MAX_RECORD_LIMIT,
  REQUEST_LOGGER,
  MAX_DYNAMIC_IMPORT_RETRIES,
};

export default config;
