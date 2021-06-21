import preval from 'next-plugin-preval';
import { ParsedDataModel2 } from '@/types/models';
import { parseAttributes, parseAssociations } from '@/utils/models';
import { getStaticModels } from './models';

async function buildModels(): Promise<Record<string, ParsedDataModel2>> {
  const models = await getStaticModels();

  return Object.entries(models).reduce((acc, [name, schema]) => {
    const attributes = parseAttributes(schema, { excludeForeignKeys: true });
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
