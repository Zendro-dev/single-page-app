const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();
const BASEPATH = String(
  process.env.NEXT_PUBLIC_ZENDRO_BASEPATH
    ? process.env.NEXT_PUBLIC_ZENDRO_BASEPATH.replace(
        /\/*([a-zA-Z]+)\/*/g,
        '/$1'
      )
    : ''
);

/**
 * @typedef {import('next/dist/next-server/server/config').NextConfig} NextConfig NextJS configuration
 * @type {NextConfig}
 */
const config = {
  reactStrictMode: true,
  ...(BASEPATH && { basePath: BASEPATH }),
};

module.exports = withNextPluginPreval(config);
