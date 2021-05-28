import { mkdir, stat, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { AppRoutes2 } from '@/types/routes';
import { getStaticRoutes2 } from './routes';

async function buildRoutes(): Promise<AppRoutes2> {
  const routesFile = 'routes.json';
  const customPath = process.cwd() + `/src/custom/${routesFile}`;
  const overridePath = process.cwd() + `/src/${routesFile}`;

  let routes = await getStaticRoutes2();
  await mkdir('src/custom', { recursive: true });
  await writeFile(customPath, JSON.stringify(routes, null, 2));

  try {
    await stat(overridePath);
    routes = require(overridePath);
  } catch (error) {
    console.log('Override for "routes.json" not found. Loading defaults.');
  }

  return routes;
}

export default preval(buildRoutes());
