import { readdir, readFile, stat } from 'fs/promises';
import { parse } from 'path';
import { DataModel, DataModels, PathParams } from '../types/models';
import { AppRoutes, ModelRoute } from '../types/routes';

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function getStaticModel(name: string): Promise<DataModel> {
  const modelPath = await whichModel(name);
  const json = await readFile(modelPath, { encoding: 'utf8' });
  return JSON.parse(json) as DataModel;
}

/**
 * Parse each data model into its javascript object representation.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticModels(): Promise<DataModels> {
  const models: DataModels = {};

  const dataModels = await readdir('./models');
  const adminModels = await readdir('./admin');

  for (const file of [...adminModels, ...dataModels]) {
    const { name } = parse(file);
    const dataModel = await getStaticModel(name);
    models[name] = dataModel;
  }

  return models;
}

/**
 * Compose static paths for the dynamic [model] pages.
 */
export async function getStaticModelPaths(): Promise<
  Array<{ params: PathParams }>
> {
  const routes = await getStaticRoutes();
  const getModelNames = ({ name }: ModelRoute): { params: PathParams } => ({
    params: { model: name },
  });
  const adminRoutes = routes.admin.map(getModelNames);
  const modelRoutes = routes.models.map(getModelNames);

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
 * Finds the path of a static model.
 * @param name model name
 */
export async function whichModel(name: string): Promise<string> {
  let modelPath: string;

  try {
    await stat(`./models/${name}.json`);
    modelPath = `./models/${name}.json`;
  } catch {
    await stat(`./admin/${name}.json`);
    modelPath = `./admin/${name}.json`;
  }

  return modelPath;
}
