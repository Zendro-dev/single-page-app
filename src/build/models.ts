import { readdir, readFile, stat } from 'fs/promises';
import { parse } from 'path';
import { DataModel, ParsedDataModel, ParsedDataModel3 } from '@/types/models';
import { parseAssociations, parseAttributes } from '@/utils/models';

interface StaticModels {
  [name: string]: DataModel;
}
interface ParsedModels {
  admin: { [name: string]: ParsedDataModel3 };
  models: { [name: string]: ParsedDataModel3 };
}

/**
 * Parse each data model into its javascript object representation.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticModels2(): Promise<ParsedModels> {
  const adminModelNames = await readdir('./admin');
  const dataModelNames = await readdir('./models');

  const loadModels = async (
    modelFile: string,
    modelsObject: StaticModels
  ): Promise<StaticModels> => {
    const parsedFile = parse(modelFile);
    const staticModel = await loadStaticModel(parsedFile.name);
    return {
      ...modelsObject,
      [parsedFile.name]: staticModel,
    };
  };

  let adminModels: StaticModels = {};
  for (const file of adminModelNames)
    adminModels = await loadModels(file, adminModels);

  let dataModels: StaticModels = {};
  for (const file of [...adminModelNames, ...dataModelNames]) {
    dataModels = await loadModels(file, dataModels);
  }

  const parseModels = <
    T extends ParsedModels['admin'] | ParsedModels['models']
  >(
    acc: T,
    [name, schema]: [string, DataModel]
  ): T => {
    const attributes = parseAttributes(schema, { excludeForeignKeys: true });
    const associations = schema.associations
      ? parseAssociations(schema)
      : undefined;
    const primaryKey = Object.keys(attributes)[0];
    return {
      ...acc,
      [name]: {
        ...schema,
        attributes,
        associations,
        primaryKey,
      },
    };
  };

  const admin = Object.entries(adminModels).reduce<ParsedModels['admin']>(
    parseModels,
    {}
  );

  const models = Object.entries(dataModels).reduce<ParsedModels['models']>(
    parseModels,
    {}
  );

  return {
    admin,
    models,
  };
}

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function loadStaticModel(name: string): Promise<DataModel> {
  const modelPath = await whichModel(name);
  const json = await readFile(modelPath, { encoding: 'utf8' });
  const dataModel = JSON.parse(json) as DataModel;
  return dataModel;
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

/* DEPRECATED */

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function getStaticModel(name: string): Promise<ParsedDataModel> {
  const modelPath = await whichModel(name);
  const json = await readFile(modelPath, { encoding: 'utf8' });
  const dataModel = JSON.parse(json) as DataModel;
  return {
    primaryKey: dataModel.internalId ?? 'id',
    ...dataModel,
  };
}

/**
 * Parse each data model into its javascript object representation.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticModels(): Promise<
  Record<string, ParsedDataModel>
> {
  const models: Record<string, ParsedDataModel> = {};

  const dataModels = await readdir('./models');
  const adminModels = await readdir('./admin');

  for (const file of [...adminModels, ...dataModels]) {
    const { name } = parse(file);
    const dataModel = await getStaticModel(name);
    models[name] = dataModel;
  }

  return models;
}
