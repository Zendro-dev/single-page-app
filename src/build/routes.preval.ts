import { mkdir, stat, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { AppRoutes2 } from '@/types/routes';
import { getStaticRoutes2 } from './routes';

async function buildRoutes(): Promise<AppRoutes2> {
  const routesJson = 'src/custom/routes.json';
  let routes: AppRoutes2;

  try {
    await stat(routesJson);
    routes = require(routesJson);
  } catch (error) {
    routes = await getStaticRoutes2();
    await mkdir('src/custom', { recursive: true });
    await writeFile(routesJson, JSON.stringify(routes, null, 2));
  }

  return routes;
}

export default preval(buildRoutes());
