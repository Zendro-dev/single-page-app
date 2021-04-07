import { mkdir, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { join } from 'path';
import { format } from 'prettier';
import { StaticQueries } from '@/types/static';
import { getStaticQueries } from '@/utils/static';

async function buildQueries(): Promise<Record<string, StaticQueries>> {
  const modelQueries = await getStaticQueries();

  for (const [model, { assoc, ...queries }] of Object.entries(modelQueries)) {
    const modelDir = `src/custom/queries/${model}`;
    await mkdir(modelDir, { recursive: true });

    // Generate in-model queries
    for (const { name, query } of Object.values(queries)) {
      await writeFile(
        join(modelDir, name) + '.gql',
        format(query, { parser: 'graphql' })
      );
    }

    // Generate association-specific queries
    for (const { name, query } of Object.values(assoc)) {
      await writeFile(
        join(modelDir, name) + '.gql',
        format(query, { parser: 'graphql' })
      );
    }
  }

  return modelQueries;
}

export default preval(buildQueries());
