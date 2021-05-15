import { readdir } from 'fs/promises';
import { parse } from 'path';
import {
  AppRoutes,
  AppRoutes2,
  ModelRoute,
  ModelUrlQuery,
  RouteLink,
} from '../types/routes';

/**
 * Compose static paths for the dynamic [model] pages.
 */
export async function getStaticModelPaths(): Promise<
  { params: ModelUrlQuery }[]
> {
  const routes = await getStaticRoutes();
  const getModelNames = (group: string) => ({
    name,
  }: ModelRoute): { params: ModelUrlQuery } => ({
    params: { group, model: name },
  });
  const adminRoutes = routes.admin.map(getModelNames('admin'));
  const modelRoutes = routes.models.map(getModelNames('models'));

  return [...adminRoutes, ...modelRoutes];
}

/**
 * Parse each data model path into a valid application route.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticRoutes(): Promise<AppRoutes> {
  const parseRoutes = (file: string): ModelRoute => {
    const { name } = parse(file);
    return {
      name,
      href: `/${name}`,
    };
  };

  const dataModels = await readdir('./models');
  const models = dataModels.map(parseRoutes);

  const adminModels = await readdir('./admin');
  const admin = adminModels.map(parseRoutes);

  return {
    admin,
    models,
  };
}

/**
 * Parse admin and data models into an array of routes.
 * @returns an array of route groups and links
 */
export async function getStaticRoutes2(): Promise<AppRoutes2> {
  const dataModels = await readdir('./models');
  const models = dataModels.map(parseModelsAsRoutes('models'));

  const adminModels = await readdir('./admin');
  const admin = adminModels.map(parseModelsAsRoutes('admin'));

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
      routes: models,
    },
    {
      type: 'group',
      name: 'Admin',
      icon: 'SupervisorAccountRounded',
      routes: admin,
    },
  ];
}

export const parseModelsAsRoutes = (group: string) => (
  file: string
): RouteLink => {
  const { name } = parse(file);
  return {
    type: 'link',
    name,
    href: `/${group}/${name}`,
  };
};
