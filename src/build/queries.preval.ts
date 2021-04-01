// import { mkdir, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
// import { join } from 'path';
// import { format } from 'prettier';
import { getStaticQueries } from '@/utils/static';
import { StaticQueries } from '@/types/static';

async function buildQueries(): Promise<Record<string, StaticQueries>> {
  const modelQueries = await getStaticQueries();

  // for (const [model, queries] of Object.entries(modelQueries)) {
  //   const modelDir = `src/custom/queries/${model}`;
  //   await mkdir(modelDir, { recursive: true });
  //   for (const [queryName, { query }] of Object.entries(queries)) {
  //     await writeFile(
  //       join(modelDir, queryName) + '.gql',
  //       format(query, { parser: 'graphql' })
  //     );
  //   }
  // }

  return modelQueries;
}

export default preval(buildQueries());
