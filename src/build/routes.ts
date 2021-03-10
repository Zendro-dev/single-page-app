import { mkdir, readdir, stat, writeFile } from 'fs/promises';
import { parse } from 'path';

import { RawModule } from '@/types/build';
import { ModelRoute } from '@/types/routes';

export default async (): Promise<RawModule> => {
  const adminModels = await readdir('./admin');
  const dataModels = await readdir('./models');

  // Generate the default set of routes
  const parseRoutes = (file: string): ModelRoute => {
    const { name } = parse(file);
    return {
      name,
      href: `/${name}`,
    };
  };

  const routes = [...adminModels, ...dataModels].map(parseRoutes);

  // Create a default routes file if it does not exist
  const customDir = './src/custom';
  const routesFile = `${customDir}/routes.json`;
  try {
    await stat(routesFile);
  } catch (error) {
    await mkdir(customDir, { recursive: true });
    await writeFile(routesFile, JSON.stringify(routes, null, 2));
  }

  return {
    cacheable: true,
    code: `module.exports = ${JSON.stringify(routes)}`,
  };
};
