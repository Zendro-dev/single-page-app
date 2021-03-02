import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import { QueryModelTableRecords, QueryRecordAttributes, QueryCsvTemplate, QueryBulkCreate } from '@/types/queries';

/**
 * Compose a readMany graphql query to retrieve a list of model records.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 */
export const queryModelTableRecords: QueryModelTableRecords = (
  modelName,
  attributes
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
  };
};

/**
 * Compose a readOne graphql query to retrieve a single record attribute values.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 */
export const queryRecordAttributes: QueryRecordAttributes = (
  modelName,
  attributes
) => {
  const { nameCp } = getInflections(modelName);
  const fields = getAttributeFields(attributes);

  const primaryKey =
    attributes.find((attribute) => attribute?.primaryKey)?.name ?? 'id';
  const resolver = `readOne${nameCp}`;
  const query = `query getRecordAttributes($id: ID!) {
    ${resolver}(${primaryKey}: $id) {
      ${fields}
    }
  }`;

  return {
    resolver,
    query,
  };
};

export const queryCsvTemplate: QueryCsvTemplate = (
  modelName
) => {
  const {nameCp} = getInflections(modelName);

  const resolver = `csvTableTemplate${nameCp}`;
  const query = `query {${resolver}}`

  return {
    resolver,
    query
  }
}

export const queryBulkCreate: QueryBulkCreate = (
  modelName
) => {
  const {nameCp} = getInflections(modelName);

  const resolver = `bulkAdd${nameCp}Csv`;
  const query = `mutation {${resolver}}`;
  return {
    resolver,
    query
  }
}

/**
 * Convert an array of parsed attributes to a string of names. This function
 * can be used to generate the list of fields within a graphql query.
 * @param attributes an array of attributes parsed server-side
 */
function getAttributeFields(attributes: ParsedAttribute[]): string {
  return attributes.map(({ name }) => name).join(' ');
}
