import preval from 'next-plugin-preval';
import { ParsedDataModel } from '@/types/models';
import { parseStaticModels } from './models';

async function buildModels(): Promise<Record<string, ParsedDataModel>> {
  const models = await parseStaticModels();

  // Filter out foreign key attributes
  const dataModelEntries = Object.entries(models).map(
    ([modelName, modelData]) => {
      const attributes = modelData.attributes.filter(
        (attribute) => !attribute.foreignKey
      );
      const foreignKeys = modelData.attributes.filter(
        (attribute) => attribute.foreignKey
      );
      return [
        modelName,
        {
          ...modelData,
          attributes,
          foreignKeys,
        },
      ];
    }
  );

  const dataModels = Object.fromEntries(dataModelEntries);

  return dataModels;
}

export default preval(buildModels());
