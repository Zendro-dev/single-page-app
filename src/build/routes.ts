import { readdir, readFile } from 'fs/promises';
import { parse } from 'path';
import {
  AssociationUrlQuery,
  AppRoutes,
  ModelRoutes,
  ModelUrlQuery,
  RecordUrlQuery,
  RouteLink,
} from '@/types/routes';
import { log } from '@/utils/logs';
import { getStaticModel } from './models';

/**
 * Parse each data model path into a valid application route.
 * @param modelPaths array of paths to each data model file
 */
export async function getModelRoutes(): Promise<ModelRoutes> {
  const parseModelsAsRoutes = (group: string) => (file: string): RouteLink => {
    const { name } = parse(file);
    return {
      type: 'link',
      name,
      href: `/${group}/${name}`,
    };
  };

  const adminModels = await readdir('./admin');
  const admin = adminModels.map(parseModelsAsRoutes('admin'));

  const dataModels = await readdir('./models');
  const models = dataModels.map(parseModelsAsRoutes('models'));

  return {
    admin,
    models,
  };
}

/**
 * Parse admin and data models into an array of routes.
 * @returns an array of route groups and links
 */
export async function getModelNavRoutes(): Promise<AppRoutes> {
  const modelRoutes = await getModelRoutes();

  return [
    {
      type: 'link',
      name: 'Home',
      icon: 'Home',
      href: '/models',
    },
    {
      type: 'group',
      name: 'Models',
      icon: 'BubbleChart',
      routes: modelRoutes.models,
    },
    {
      type: 'group',
      name: 'Admin',
      icon: 'SupervisorAccountRounded',
      routes: modelRoutes.admin,
    },
  ];
}

/**
 * Compose static model paths to consumed in dynamic model pages.
 * @returns the composed dynamic URL queries
 */
export async function getStaticModelPaths(): Promise<
  Array<{ params: ModelUrlQuery }>
> {
  const modelRoutes = await getModelRoutes();

  let overrides: string[];

  try {
    const overridesJson = await readFile('./src/config/page-overrides.json', {
      encoding: 'utf8',
    });
    overrides = JSON.parse(overridesJson);
  } catch (error) {
    overrides = [];
  }

  const composeUrlQuery = (group: string) => ({
    name,
  }: RouteLink): { params: ModelUrlQuery } => ({
    params: { group, model: name },
  });

  const adminPaths = modelRoutes.admin
    .filter(({ href }) => !overrides?.includes(href))
    .map(composeUrlQuery('admin'));

  const modelPaths = modelRoutes.models
    .filter(({ href }) => !overrides?.includes(href))
    .map(composeUrlQuery('models'));

  return [...adminPaths, ...modelPaths];
}

/**
 * Compose static record paths to be consumed in dynamic record pages.
 * @returns the composed dynamic record page URL queries
 */
export async function getStaticRecordPaths(): Promise<
  Array<{ params: RecordUrlQuery }>
> {
  // Compose record page requests
  const modelPaths = await getStaticModelPaths();
  const requests = ['details', 'edit', 'new'];

  const addPageRequests = (
    recordPaths: Array<{ params: RecordUrlQuery }>,
    path: { params: ModelUrlQuery }
  ): Array<{ params: RecordUrlQuery }> => {
    requests.forEach((request) => {
      recordPaths.push({ params: { ...path.params, request } });
    });
    return recordPaths;
  };

  let recordPaths = modelPaths.reduce(addPageRequests, []);

  // Remove user-defined overrides
  try {
    const overridesJson = await readFile('./src/config/page-overrides.json', {
      encoding: 'utf8',
    });
    const overrides: string[] = JSON.parse(overridesJson);

    const removeOverrides = (path: { params: RecordUrlQuery }): boolean => {
      const { group, model, request } = path.params;
      return !overrides.includes(`/${group}/${model}/${request}`);
    };

    recordPaths = recordPaths.filter(removeOverrides);
  } catch (error) {
    log('custom page overrides not found, loading default paths');
  }

  return recordPaths;
}

export async function getStaticAssociationPaths(): Promise<
  Array<{ params: AssociationUrlQuery }>
> {
  const recordPaths = await getStaticRecordPaths();

  const associationPaths: Array<{ params: AssociationUrlQuery }> = [];
  for (const path of recordPaths) {
    const { associations } = await getStaticModel(path.params.model);
    if (associations) {
      Object.keys(associations).forEach((association) =>
        associationPaths.push({
          params: { ...path.params, association },
        })
      );
    }
  }

  return associationPaths;
}
