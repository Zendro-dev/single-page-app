import { Inflection } from '@/utils/inflection';

/**
 * Compose the readMany graphql-query that the table sends to the server to recieve records
 *
 * @param dataModel dataModel for which to compose the query
 * @param inflections inflections for the dataModel
 */
export function getTableQuery(
  attributesList: string,
  inflections: Inflection
): string {
  return `query ${inflections.namePlLc}Connection(
    $order: [order${inflections.nameCp}Input],
    $search: search${inflections.nameCp}Input,
    $pagination: paginationCursorInput!) { 
    ${inflections.namePlLc}Connection( order: $order, search: $search, pagination: $pagination ) {
       pageInfo { startCursor, endCursor, hasPreviousPage, hasNextPage }
       edges { node { ${attributesList} }}
  }}`;
}
