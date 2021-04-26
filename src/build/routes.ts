import { readdir } from 'fs/promises';
import { parse } from 'path';
import {
  AppRoute,
  AppRoutes,
  AppRoutes2,
  ModelRoute,
  ModelUrlQuery,
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
export async function getStaticRecordPaths(
  requests: string[] = ['details', 'edit', 'new']
): Promise<AppRoutes2> {
  const parseRoute = (group: string, model: string) => (
    request?: string
  ): AppRoute => {
    return {
      name: model,
      href: `/${group}/${model}` + request ? `/${request}` : '',
      params: { group, model: model, request },
    };
  };

  const adminModels = await readdir('./admin');
  const admin = adminModels.reduce<AppRoute[]>((adminRoutes, modelFile) => {
    const model = parse(modelFile).name;
    const modelRoute = parseRoute('admin', model)();
    const recordRoutes = requests.map(parseRoute('admin', model));
    return [...adminRoutes, modelRoute, ...recordRoutes];
  }, []);

  const dataModels = await readdir('./models');
  const models = dataModels.reduce<AppRoute[]>((modelRoutes, modelFile) => {
    const model = parse(modelFile).name;
    const modelRoute = parseRoute('models', model)();
    const recordRoutes = requests.map(parseRoute('models', model));
    return [...modelRoutes, modelRoute, ...recordRoutes];
  }, []);

  return {
    admin,
    models,
  };
}

/**
 * Parse each data model path into a valid application route.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticRoutes2(
  requests: string[] = ['details', 'edit', 'new']
): Promise<AppRoutes2> {
  const parseRoute = (group: string, model: string) => (
    request?: string
  ): AppRoute => {
    return {
      name: model,
      href: `/${group}/${model}` + request ? `/${request}` : '',
      params: { group, model: model, request },
    };
  };

  const adminModels = await readdir('./admin');
  const admin = adminModels.reduce<AppRoute[]>((adminRoutes, modelFile) => {
    const model = parse(modelFile).name;
    const modelRoute = parseRoute('admin', model)();
    const recordRoutes = requests.map(parseRoute('admin', model));
    return [...adminRoutes, modelRoute, ...recordRoutes];
  }, []);

  const dataModels = await readdir('./models');
  const models = dataModels.reduce<AppRoute[]>((modelRoutes, modelFile) => {
    const model = parse(modelFile).name;
    const modelRoute = parseRoute('models', model)();
    const recordRoutes = requests.map(parseRoute('models', model));
    return [...modelRoutes, modelRoute, ...recordRoutes];
  }, []);

  return {
    admin,
    models,
  };
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
