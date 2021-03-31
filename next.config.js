const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();

/**
 * @typedef {import('next/dist/next-server/server/config').NextConfig} NextConfig NextJS configuration
 * @type {NextConfig}
 */
const config = {
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
};

module.exports = withNextPluginPreval(config);
