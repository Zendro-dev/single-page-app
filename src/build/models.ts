import { readdir, readFile, stat } from 'fs/promises';
import { parse } from 'path';
import { DataModel, ParsedDataModel } from '@/types/models';
import {
  getModelApiPrivileges,
  parseAssociations,
  parseAttributes,
} from '@/utils/models';

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function parseStaticModel(name: string): Promise<ParsedDataModel> {
  // Find the model path
  const modelPath = await whichModel(name);

  // Load the raw model JSON
  const json = await readFile(modelPath, { encoding: 'utf8' });
  const dataModel = JSON.parse(json) as DataModel;

  // Parse attributes (including foreign keys) and associations
  const attributes = parseAttributes(dataModel);
  const associations = parseAssociations(dataModel);

  // Compute supported API functionality
  const apiPrivileges = getModelApiPrivileges(dataModel.storageType);

  return {
    ...dataModel,
    apiPrivileges,
    associations,
    attributes,
    primaryKey: dataModel.internalId ?? 'id',
  };
}

/**
 * Parse each data model into its javascript object representation.
 * @param modelPaths array of paths to each data model file
 */
export async function parseStaticModels(): Promise<
  Record<string, ParsedDataModel>
> {
  const models: Record<string, ParsedDataModel> = {};

  const dataModels = await readdir('./models');
  const adminModels = await readdir('./admin');

  for (const filePath of [...adminModels, ...dataModels]) {
    const file = parse(filePath);
    const dataModel = await parseStaticModel(file.name);
    models[dataModel.model] = dataModel;
  }

  return models;
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
