const { relative: pathRelative, join: pathJoin } = require('path');

/**
 * @typedef  {Object} ModulePaths
 * @property {string} absolute  path from the project root
 * @property {string} relative  path from the build folder
 * @property {string} buildDir  path to the build folder
 * @property {string} customDir path to the custom folder
 *
 * @typedef  {Object} Options
 * @property {string} buildDir path from the build folder
 * @property {string} customDir   path to the custom folder
 **/

/**
 * Resolve the absolute and relative paths to a custom module.
 *
 * NextJS resolves build-time paths from the application root folder, but
 * dynamic imports are still resolved using relative paths. Because during
 * the generator step we may import an existing custom file, the two paths
 * are necessary.
 *
 * @param   {string}      file    custom module file
 * @param   {Options}     options options for source and destination paths
 * @returns {ModulePaths} absolute and relative paths to the module
 */
function resolveCustom(
  file,
  options = { buildDir: './src/build', customDir: './src/custom' }
) {
  /**
   * NextJS resolves build-time paths from the application root folder, but
   * dynamic imports are still resolved using relative paths. Because we may
   * import an existing `acl-rules.json` file, the two paths are necessary.
   */

  const { buildDir, customDir } = options;
  const absolute = pathJoin(customDir, file);
  const relative = pathJoin(pathRelative(buildDir, customDir), file);

  return {
    buildDir,
    customDir,
    absolute,
    relative,
  };
}

module.exports = {
  resolveCustom,
};
