import { mkdir, readdir, stat, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { parse } from 'path';
import { AppRoutes } from '@/types/routes';

async function buildRoutes(): Promise<AppRoutes> {
  const routesPath = 'src/custom/routes.json';
  let routes: AppRoutes;

  const parseRoutes = (group: string) => (file: string) => {
    const { name } = parse(file);
    return {
      name,
      href: `/${group}/${name}`,
    };
  };

  try {
    await stat(routesPath);
    routes = require(routesPath);
  } catch (error) {
    const adminModels = await readdir('./admin');
    const dataModels = await readdir('./models');

    const admin = adminModels.map(parseRoutes('admin'));
    const models = dataModels.map(parseRoutes('models'));

    routes = {
      admin,
      models,
    };

    await mkdir('src/custom', { recursive: true });
    await writeFile(routesPath, JSON.stringify(routes, null, 2));
  }

  return routes;
}

export default preval(buildRoutes());
