import { mkdir, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { join } from 'path';
import { format } from 'prettier';
import { StaticQueries } from '@/types/static';
import { getStaticQueries } from './queries';

async function buildQueries(): Promise<Record<string, StaticQueries>> {
  const modelQueries = await getStaticQueries();

  for (const [model, { withFilter, ...queries }] of Object.entries(
    modelQueries
  )) {
    const modelDir = `src/custom/queries/${model}`;
    await mkdir(modelDir, { recursive: true });

    // Generate in-model queries
    for (const { name, query } of Object.values(queries)) {
      await writeFile(
        join(modelDir, name) + '.gql',
        format(query, { parser: 'graphql' })
      );
    }
    // Generate association queries
    for (const assocQueries of Object.values(withFilter)) {
      for (const { name, query } of Object.values(assocQueries)) {
        await writeFile(
          join(modelDir, name) + '.gql',
          format(query, { parser: 'graphql' })
        );
      }
    }
  }

  return modelQueries;
}

export default preval(buildQueries());
