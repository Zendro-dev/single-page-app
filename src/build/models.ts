import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { DataModel, ParsedDataModel } from '@/types/models';
import {
  getModelApiPrivileges,
  parseAssociations,
  parseAttributes,
} from '@/utils/models';

/**
 * Get the full paths to the static data model files.
 * @returns the resolved static model paths
 */
export async function getStaticModels(): Promise<{
  models: string[];
}> {
  const MODELS_PATH = process.env.ZENDRO_DATA_MODELS;

  let modelFiles: string[];

  // The ZENDRO_DATA_MODELS env variable is mandatory
  if (!MODELS_PATH) {
    throw new Error(
      'No data models folder defined, ' +
        'please make sure the "ZENDRO_DATA_MODELS" env variable has been set'
    );
  }

  // Ensure the models folders exist
  try {
    await stat(MODELS_PATH);

    // Warn if the data models folder is empty
    modelFiles = await readdir(MODELS_PATH);
    if (modelFiles.length === 0) {
      console.warn(`The defined data models folder is empty (${MODELS_PATH})`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(
        `The "ZENDRO_DATA_MODELS" folder ("${MODELS_PATH}") does not exist`
      );
    }
    throw error;
  }

  // Resolve model paths
  const resolvePaths =
    (folderPath: string) =>
    (file: string): string =>
      path.resolve(path.join(folderPath, file));

  return {
    models: modelFiles.map(resolvePaths(MODELS_PATH)),
  };
}

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function parseStaticModel(
  modelPath: string
): Promise<ParsedDataModel> {
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
    foreignKeys: [],
    primaryKey: dataModel.internalId ?? 'id',
  };
}

/**
 * Parse static model files into their JavaScript object representation.
 * @param group group models by their source (i.e. models)
 */
export async function parseStaticModels(
  group?: false
): Promise<Record<string, ParsedDataModel>>;

/**
 * Parse static model files into their JavaScript object representation and
 * group them according to the source (i.e. models).
 * @param group group models by their source
 */
export async function parseStaticModels(group: true): Promise<{
  models: Record<string, ParsedDataModel>;
}>;

export async function parseStaticModels(group?: boolean): Promise<
  | Record<string, ParsedDataModel>
  | {
      models: Record<string, ParsedDataModel>;
    }
> {
  const models: Record<string, ParsedDataModel> = {};

  const modelFiles = await getStaticModels();

  for (const filePath of modelFiles.models) {
    const dataModel = await parseStaticModel(filePath);

    // Skip distributed data model adapters
    if (dataModel.model.includes('-adapter')) continue;

    models[dataModel.model] = dataModel;
  }

  // Return models grouped by their source type
  if (group) {
    return {
      models,
    };
  }

  // Return all models in a single object
  return Object.assign<
    Record<string, ParsedDataModel>,
    Record<string, ParsedDataModel>
  >({}, models);
}

/**
 * Parse a list of parsed Data models models and their associations to filter for cross-table models
 * @param parsedModels List of parsed Data models.
 * @returns A list of unique names for models that are representing a sql cross table.
 */
export function getCrossModels(parsedModels: ParsedDataModel[]): string[] {
  const cross_models = parsedModels.reduce<string[]>((acc, curr) => {
    curr.associations?.forEach((assoc) => {
      if (assoc.implementation === 'sql_cross_table')
        acc.push(assoc.keysIn as string);
    });
    return acc;
  }, []);
  return [...new Set(cross_models)];
}
