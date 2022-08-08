import { readFile } from 'fs/promises';
import {
  AssociationUrlQuery,
  AppRoutes,
  ModelRoutes,
  ModelUrlQuery,
  RecordUrlQuery,
  RouteLink,
} from '@/types/routes';
import { parseStaticModels, getCrossModels } from './models';
import { ParsedDataModel } from '@/types/models';

/**
 * Parse each data model path into a valid application route.
 * @param modelPaths array of paths to each data model file
 */
export async function parseDataModels(): Promise<{
  models: ParsedDataModel[];
}> {
  const modelFiles = await parseStaticModels(true);

  return {
    models: Object.values(modelFiles.models),
  };
}

/**
 * Parse data models into an array of routes.
 * @returns an array of route groups and links
 */
export async function getModelNavRoutes(): Promise<AppRoutes> {
  const parsedModels = await parseDataModels();

  const crossModels = {
    models: getCrossModels(parsedModels.models),
  };

  const parseModelAsRoute =
    (group: string) =>
    ({ model }: ParsedDataModel): RouteLink => {
      return {
        type: 'link',
        name: model,
        href: `/${group}/${model}`,
      };
    };

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
      routes: parsedModels.models
        .filter((model) => !crossModels.models.includes(model.model))
        .map(parseModelAsRoute('models')),
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
  const parsedModels = await parseDataModels();

  // Generate model paths
  const composeUrlQuery =
    (group: string) =>
    ({ model }: ParsedDataModel): { params: ModelUrlQuery } => ({
      params: { group, model },
    });

  let modelPaths = parsedModels.models.map(composeUrlQuery('models'));

  // Remove custom overrides from generated paths
  try {
    const overridesJson = await readFile('./src/config/page-overrides.json', {
      encoding: 'utf8',
    });

    const overrides: string[] = JSON.parse(overridesJson);

    const removeOverrides = (path: { params: ModelUrlQuery }): boolean =>
      !overrides.includes(`/${path.params.group}/${path.params.model}`);

    modelPaths = modelPaths.filter(removeOverrides);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return [...modelPaths];
}

/**
 * Compose static record paths to be consumed in dynamic record pages.
 * @returns the composed dynamic record page URL queries
 */
export async function getStaticRecordPaths(): Promise<
  Array<{ params: RecordUrlQuery }>
> {
  // Compose record page requests
  const parsedModels = await parseDataModels();
  const requests = ['details', 'edit', 'new'];

  const composeRecordUrlQuery =
    (group: string) =>
    (
      recordPaths: Array<{ params: RecordUrlQuery }>,
      parsedModel: ParsedDataModel
    ): Array<{ params: RecordUrlQuery }> => {
      for (const request of requests) {
        // Skip not supported operations
        if (
          (request === 'edit' && !parsedModel.apiPrivileges.update) ||
          (request === 'new' && !parsedModel.apiPrivileges.create)
        ) {
          continue;
        }

        // Add path to attributes page
        recordPaths.push({
          params: { group, model: parsedModel.model, request },
        });
      }
      return recordPaths;
    };

  const modelPaths = parsedModels.models.reduce(
    composeRecordUrlQuery('models'),
    []
  );

  let recordPaths = [...modelPaths];

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
    if (error.code !== 'ENOENT') throw error;
  }

  return recordPaths;
}

export async function getStaticAssociationPaths(): Promise<
  Array<{ params: AssociationUrlQuery }>
> {
  // Compose association page requests
  const parsedModels = await parseDataModels();
  const requests = ['details', 'edit', 'new'];

  let associationPaths: Array<{ params: AssociationUrlQuery }> = [];
  for (const group in parsedModels) {
    const groupModels = parsedModels[group as keyof ModelRoutes];

    for (const parsedModel of groupModels) {
      for (const request of requests) {
        // Skip not supported operations
        if (
          (request === 'edit' && !parsedModel.apiPrivileges.update) ||
          (request === 'new' && !parsedModel.apiPrivileges.create)
        ) {
          continue;
        }

        // Add path to association pages
        parsedModel.associations?.forEach((assoc) =>
          associationPaths.push({
            params: {
              group,
              model: parsedModel.model,
              request,
              association: assoc.name,
            },
          })
        );
      }
    }
  }

  // Remove user-defined overrides
  try {
    const overridesJson = await readFile('./src/config/page-overrides.json', {
      encoding: 'utf8',
    });
    const overrides: string[] = JSON.parse(overridesJson);

    associationPaths = associationPaths.filter((path) => {
      const { group, model, request, association } = path.params;
      return !overrides.includes(
        `/${group}/${model}/${request}/${association}`
      );
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return associationPaths;
}
