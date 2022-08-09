const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();

/**
 * @typedef {import('next/dist/next-server/server/config').NextConfig} NextConfig NextJS configuration
 * @type {NextConfig}
 */
const config = {
  reactStrictMode: true,
  basePath: '/spa',
};

module.exports = withNextPluginPreval(config);
