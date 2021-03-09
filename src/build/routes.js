const { readdir, stat, writeFile } = require('fs/promises');
const { parse } = require('path');

module.exports = async () => {
  const adminModels = await readdir('./admin');
  const dataModels = await readdir('./models');

  // Generate the default set of routes
  const parseRoutes = (file) => {
    const { name } = parse(file);
    return {
      name,
      href: `/${name}`,
    };
  };

  const routes = [...adminModels, ...dataModels].map(parseRoutes);

  // Create a default routes file if it does not exist
  const routesFile = './src/config/routes.json';
  try {
    await stat(routesFile);
  } catch (error) {
    await writeFile(routesFile, JSON.stringify(routes, null, 2));
  }

  return {
    cacheable: false,
    code: `module.exports = ${JSON.stringify(routes)}`,
  };
};
