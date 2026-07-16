import { AppRoutes, RouteLink } from '@/types/routes';
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
