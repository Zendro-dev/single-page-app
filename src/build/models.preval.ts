import preval from 'next-plugin-preval';
import { ParsedDataModel } from '@/types/models';
import { getStaticModels } from './models';

async function buildModels(): Promise<Record<string, ParsedDataModel>> {
  const models = await getStaticModels();

  // Filter out foreign key attributes
  const dataModelEntries = Object.entries(models).map(
    ([modelName, modelData]) => {
      const attributes = modelData.attributes.filter(
        (attribute) => !attribute.foreignKey
      );

      return [
        modelName,
        {
          ...modelData,
          attributes,
        },
      ];
    }
  );

  const dataModels = Object.fromEntries(dataModelEntries);

  return dataModels;
}

export default preval(buildModels());
