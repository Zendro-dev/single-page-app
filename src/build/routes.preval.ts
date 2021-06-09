import { mkdir, stat, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { AppRoutes } from '@/types/routes';
import { zendrify } from '@/utils/logs';
import { getModelNavRoutes } from './routes';

async function buildRoutes(): Promise<AppRoutes> {
  const routesFile = 'routes.json';
  const customPath = process.cwd() + `/src/custom/${routesFile}`;
  const overridePath = process.cwd() + `/src/${routesFile}`;

  let routes = await getModelNavRoutes();
  await mkdir('src/custom', { recursive: true });
  await writeFile(customPath, JSON.stringify(routes, null, 2));

  try {
    await stat(overridePath);
    routes = require(overridePath);
    console.log(zendrify('Loading "routes.json" override.'));
  } catch (error) {
    console.log(
      zendrify('Override for "routes.json" not found, loading defaults.')
    );
  }

  return routes;
}

export default preval(buildRoutes());
