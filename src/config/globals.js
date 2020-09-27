module.exports = {
  GRAPHQL_SERVER_URL: process.env.REACT_APP_ZENDRO_GRAPHQL_SERVER_URL || ((process.env.REACT_APP_ZENDRO_API_URL) ? process.env.REACT_APP_ZENDRO_API_URL+"/graphql" : "http://localhost:3000/graphql"),
  LOGIN_URL: process.env.REACT_APP_ZENDRO_LOGIN_URL || ((process.env.REACT_APP_ZENDRO_API_URL) ? process.env.REACT_APP_ZENDRO_API_URL+"/login" : "http://localhost:3000/login"),
  EXPORT_URL: process.env.REACT_APP_ZENDRO_EXPORT_URL || ((process.env.REACT_APP_ZENDRO_API_URL) ? process.env.REACT_APP_ZENDRO_API_URL+"/export" : "http://localhost:3000/export"),
  MAX_UPLOAD_SIZE: process.env.REACT_APP_ZENDRO_MAX_UPLOAD_SIZE || 500, // size in MB
  MAX_RECORD_LIMIT: process.env.REACT_APP_ZENDRO_MAX_RECORD_LIMIT || 10000,
  REQUEST_LOGGER: process.env.REACT_APP_ZENDRO_REQUEST_LOGGER || true,
}