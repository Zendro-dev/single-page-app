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
        test: require.resolve('./src/build/acl-rules.ts'),
        use: [
          { loader: 'val-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'CommonJS',
              },
            },
          },
        ],
      },
      {
        test: require.resolve('./src/build/routes.ts'),
        use: [
          { loader: 'val-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'CommonJS',
              },
            },
          },
        ],
      }
    );
    return config;
  },
};

module.exports = config;
