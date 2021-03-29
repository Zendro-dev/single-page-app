const { mkdir, readdir, stat, writeFile } = require('fs/promises');
const { parse } = require('path');
const { resolveCustom } = require('./helpers/resolve-custom');

/**
 * @typedef {import('src/types/routes').ModelRoute} ModelRoute
 * @typedef {import('src/types/routes').AppRoutes}  AppRoutes
 **/

/**
 * Import custom or create default application routes.
 * @returns {AppRoutes} application routes
 */
async function buildRoutes() {
  let routes;

  const routesPath = resolveCustom('routes.json');
  const parseRoutes = (group) => (file) => {
    const { name } = parse(file);
    return {
      name,
      href: `/${group}/${name}`,
    };
  };

  try {
    await stat(routesPath.absolute);
    routes = require(routesPath.relative);
  } catch (error) {
    const adminModels = await readdir('./admin');
    const dataModels = await readdir('./models');

    const admin = adminModels.map(parseRoutes('admin'));
    const models = dataModels.map(parseRoutes('models'));

    routes = {
      admin,
      models,
    };

    await mkdir(routesPath.customDir, { recursive: true });
    await writeFile(routesPath.absolute, JSON.stringify(routes, null, 2));
  }

  return {
    cacheable: false,
    code: `module.exports = ${JSON.stringify(routes)}`,
  };
}

module.exports = buildRoutes;
