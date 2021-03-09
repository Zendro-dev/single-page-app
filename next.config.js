/**
 * @typedef {import('next/dist/next-server/server/config').NextConfig} NextConfig NextJS configuration
 * @typedef {import('webpack').Configuration} WebpackConfig Webpack configuration object
 **/

/** @type {NextConfig} */
const config = {
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  /** @type {(config: WebpackConfig) => WebpackConfig} */
  webpack: (config) => {
    config.module.rules.push(
      {
        test: require.resolve('./src/build/acl-rules.js'),
        use: [{ loader: 'val-loader' }],
      },
      {
        test: require.resolve('./src/build/routes.js'),
        use: [{ loader: 'val-loader' }],
      }
    );
    return config;
  },
};

module.exports = config;
