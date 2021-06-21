import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { DataModel, ParsedDataModel } from '@/types/models';
import {
  getModelApiPrivileges,
  parseAssociations,
  parseAttributes,
} from '@/utils/models';

/**
 * Get the full paths to the static admin and data model files.
 * @returns the resolved static model paths
 */
export async function getStaticModels(): Promise<{
  admin: string[];
  models: string[];
}> {
  const ADMIN_PATH = './src/config/admin';
  const MODELS_PATH = process.env.ZENDRO_DATA_MODELS;

  let adminFiles: string[];
  let modelFiles: string[];

  // The ZENDRO_DATA_MODELS env variable is mandatory
  if (!MODELS_PATH) {
    throw new Error(
      'No data models folder defined, ' +
        'please make sure the "ZENDRO_DATA_MODELS" env variable has been set'
    );
  }

  // Throw if somehow the admin models are not present
  try {
    await stat(ADMIN_PATH);

    adminFiles = await readdir(ADMIN_PATH);

    if (
      adminFiles.length === 0 ||
      adminFiles.join(',') !== 'role.json,role_to_user.json,user.json'
    ) {
      throw new Error(
        `The admin data models folder in ${ADMIN_PATH} is missing models`
      );
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(
        `The admin data models in ${ADMIN_PATH} could not be found`
      );
    }
    throw error;
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
  const resolvePaths = (folderPath: string) => (file: string): string =>
    path.resolve(path.join(folderPath, file));

  return {
    admin: adminFiles.map(resolvePaths(ADMIN_PATH)),
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

  const modelFiles = await getStaticModels();

  for (const filePath of [...modelFiles.admin, ...modelFiles.models]) {
    const dataModel = await parseStaticModel(filePath);
    models[dataModel.model] = dataModel;
  }

  return models;
}
