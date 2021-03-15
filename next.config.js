const { readdirSync } = require('fs');

/**
 * @typedef {import('next/dist/next-server/server/config').NextConfig} NextConfig NextJS configuration
 * @typedef {import('webpack').Configuration} WebpackConfig Webpack configuration object
 * @typedef {import('webpack').RuleSetRule} RuleSetRule Webpack module loader rule
 * @typedef {import('fs').Dirent} Dirent Webpack module loader rule
 **/

/**
 * Compose webpack rules for the build toolchain.
 * @param   {RuleSetRule[]} rules webpack loader rules
 * @param   {Dirent}        file  directory entry
 * @returns {RuleSetRule[]} the built ruleset
 */
function buildRulesReducer(rules, file) {
  if (file.isFile())
    rules.push({
      test: require.resolve(`./src/build/${file.name}`),
      use: [
        { loader: 'val-loader' },
        // {
        //   loader: 'ts-loader',
        //   options: {
        //     transpileOnly: true,
        //     compilerOptions: { module: 'CommonJS' },
        //   },
        // },
      ],
    });
  return rules;
}

/**
 * Customized webpack configuration object.
 * @param   {WebpackConfig} config default webpack configuration
 * @returns {WebpackConfig} modified configuration
 */
const webpack = (config) => {
  const buildRules = readdirSync('./src/build', {
    withFileTypes: true,
  }).reduce(buildRulesReducer, []);

  config.module.rules.push(...buildRules);
  return config;
};

/** @type {NextConfig} */
const config = {
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  webpack,
};

module.exports = config;
