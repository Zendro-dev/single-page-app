import { mkdir, writeFile } from 'fs/promises';
import preval from 'next-plugin-preval';
import { join } from 'path';
import { format } from 'prettier';
import { StaticQueries } from '@/types/static';
import { getStaticQueries } from './queries';

function formatQuery(
  name: string,
  query: string,
  resolver: string,
  transform?: string,
  assocResolver?: string
): string {
  const graphqlQuery = format(query, { parser: 'graphql' });

  const data = `
        import { gql } from 'graphql-request';

        export const name = '${name}';

        export const query = gql\`${graphqlQuery}\`;

        export const resolver = '${resolver}';

        export const transform = ${
          transform ? "'" + transform + "'" : undefined
        };
        
        ${
          assocResolver ? `export const assocResolver = '${assocResolver}'` : ''
        }

        export default {
          name,
          query,
          resolver,
          transform,
          ${assocResolver ? 'assocResolver' : ''}
        }
      `;

  return format(data, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
  });
}

async function buildQueries(): Promise<Record<string, StaticQueries>> {
  const modelQueries = await getStaticQueries();

  for (const [model, { withFilter, ...queries }] of Object.entries(
    modelQueries
  )) {
    const modelQueriesDir = `src/custom/queries/${model}`;
    await mkdir(modelQueriesDir, { recursive: true });

    /**
     * Model table queries
     */
    for (const { name, query, resolver, transform } of Object.values(queries)) {
      const formattedQuery = formatQuery(name, query, resolver, transform);
      await writeFile(join(modelQueriesDir, name) + '.ts', formattedQuery);
    }

    /**
     * Association table queries
     */
    const modelAssocQueriesDir = join(modelQueriesDir, 'associations');

    await mkdir(modelAssocQueriesDir, { recursive: true });

    for (const assocQueries of Object.values(withFilter)) {
      for (const {
        name,
        query,
        resolver,
        transform,
        assocResolver,
      } of Object.values(assocQueries)) {
        const formattedQuery = formatQuery(
          name,
          query,
          resolver,
          transform,
          assocResolver
        );

        await writeFile(
          join(modelQueriesDir, 'associations', name) + '.ts',
          formattedQuery
        );
      }
    }
  }

  return modelQueries;
}

export default preval(buildQueries());
