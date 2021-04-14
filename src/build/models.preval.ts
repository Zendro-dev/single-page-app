import { ParsedDataModel2 } from '@/types/models';
import { getAttributeList, parseAssociations } from '@/utils/models';
import { getStaticModels } from '@/utils/static';
import preval from 'next-plugin-preval';

async function buildModels(): Promise<Record<string, ParsedDataModel2>> {
  const models = await getStaticModels();

  return Object.entries(models).reduce((acc, [name, schema]) => {
    const attributes = getAttributeList(schema, { excludeForeignKeys: true });
    const associations = parseAssociations(schema);
    return {
      ...acc,
      [name]: {
        ...schema,
        associations,
        attributes,
      },
    };
  }, {} as Promise<Record<string, ParsedDataModel2>>);
}

export default preval(buildModels());
