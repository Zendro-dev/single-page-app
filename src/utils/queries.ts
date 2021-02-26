import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import { QueryModelTableRecords, QueryRecordAttributes } from '@/types/queries';

/**
 * Compose a readMany graphql query to retrieve a list of model records.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 * @param variables graphql query variables
 */
export const queryModelTableRecords: QueryModelTableRecords = (
  modelName,
  attributes,
  variables
) => {
  const { namePlLc, nameCp } = getInflections(modelName);
  const fields = getAttributeFields(attributes);

  const resolver = `${namePlLc}Connection`;
  const query = `query getModelTableRecords(
      $order: [order${nameCp}Input]
      $search: search${nameCp}Input
      $pagination: paginationCursorInput!
    ) {
      ${resolver}( order: $order search: $search, pagination: $pagination ) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node { ${fields} }
        }
      }
    }`;

  return {
    resolver,
    query,
    variables,
  };
};

/**
 * Compose a readOne graphql query to retrieve a single record attribute values.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 * @param variables graphql query variables
 */
export const queryRecordAttributes: QueryRecordAttributes = (
  modelName,
  attributes,
  variables
) => {
  const { nameCp } = getInflections(modelName);
  const fields = getAttributeFields(attributes);

  const resolver = `readOne${nameCp}`;
  const query = `query getRecordAttributes($id: ID!) {
    ${resolver}(id: $id) {
      ${fields}
    }
  }`;

  return {
    resolver,
    query,
    variables,
  };
};

/**
 * Convert an array of parsed attributes to a string of names. This function
 * can be used to generate the list of fields within a graphql query.
 * @param attributes an array of attributes parsed server-side
 */
function getAttributeFields(attributes: ParsedAttribute[]): string {
  return attributes.map(({ name }) => name).join(' ');
}
