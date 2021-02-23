export const GRAPHQL_URL = process.env.NEXT_PUBLIC_ZENDRO_GRAPHQL_URL;
export const LOGIN_URL = process.env.NEXT_PUBLIC_ZENDRO_LOGIN_URL;
export const EXPORT_URL = process.env.NEXT_PUBLIC_ZENDRO_EXPORT_URL;
export const MAX_UPLOAD_SIZE = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE
); // size in MB
export const MAX_RECORD_LIMIT = Number(
  process.env.NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT
);

const config = {
  GRAPHQL_URL,
  LOGIN_URL,
  EXPORT_URL,
  MAX_UPLOAD_SIZE,
  MAX_RECORD_LIMIT,
};

export default config;
