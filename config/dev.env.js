var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
  AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
  YOUR_CALLBACK_URL: JSON.stringify(process.env.YOUR_CALLBACK_URL),
  MY_SERVER_URL: JSON.stringify(process.env.MY_SERVER_URL),
  MY_LOGIN_URL: JSON.stringify(process.env.MY_LOGIN_URL)
})
