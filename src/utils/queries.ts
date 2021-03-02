import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import {
  MutateRecordAttributes,
  QueryModelTableRecords,
  QueryRecordAttributes,
} from '@/types/queries';

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
 * Compose a readOne graphql query to retrieve attribute values for a single record.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 */
export const readRecordAttributes: QueryRecordAttributes = (
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

export const updateRecordAttributes: MutateRecordAttributes = (
  modelName,
  attributes
) => {
  const { nameCp } = getInflections(modelName);

  const resolver = `update${nameCp}`;
  const variables = getQueryVars(attributes);
  const args = getQueryArgs(attributes);
  const fields = getAttributeFields(attributes);

  const query = `mutation updateRecordAttributes(${variables}) {
    ${resolver}(${args}) {
      ${fields}
    }
  }`;

  return {
    resolver,
    query,
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

function getQueryArgs(attributes: ParsedAttribute[]): string {
  return attributes.map(({ name }) => `${name}: $${name}`).join(' ');
}

function getQueryVars(attributes: ParsedAttribute[]): string {
  return attributes
    .map(({ name, type, primaryKey }) =>
      primaryKey ? `$${name}: ID!` : `$${name}: ${type}`
    )
    .join(' ');
}
