import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecords,
  QueryCsvTemplate,
  QueryBulkCreate,
  QueryRecord,
  QueryModelTableRecordsCount,
  RawQuery,
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
  const { fields } = parseQueryAttributes(attributes);

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

export const queryModelTableRecordsCount: QueryModelTableRecordsCount = (
  modelName
) => {
  const { nameCp, namePlCp } = getInflections(modelName);
  const resolver = `count${namePlCp}`;
  const query = `query countRecords($search: search${nameCp}Input) {
    ${resolver}( search: $search )
  }`;

  return {
    resolver,
    query,
  };
};

export const queryModel = (
  modelName: string,
  attributes: ParsedAttribute[]
): {
  records: RawQuery;
  count: RawQuery;
} => {
  const records = queryModelTableRecords(modelName, attributes);
  const count = queryModelTableRecordsCount(modelName);

  return {
    records,
    count,
  };
};

export const queryRecord: QueryRecord = (modelName, attributes) => {
  const { nameCp } = getInflections(modelName);

  const createResolver = `add${nameCp}`;
  const readResolver = `readOne${nameCp}`;
  const updateResolver = `update${nameCp}`;
  const deleteResolver = `delete${nameCp}`;

  const { args, idArg, idVar, fields, vars } = parseQueryAttributes(attributes);

  const primaryKey = attributes.find(({ primaryKey }) => primaryKey)?.name;

  if (!primaryKey)
    throw new Error(
      `Primary key attribute could not be found in model ${modelName}`
    );

  return {
    primaryKey,
    create: {
      resolver: createResolver,
      query: `mutation createRecord(${args}) { ${createResolver}(${vars}) { ${fields} } }`,
    },
    read: {
      resolver: readResolver,
      query: `query readRecord(${idArg}) { ${readResolver}(${idVar}) { ${fields} } }`,
    },
    update: {
      resolver: updateResolver,
      query: `mutation updateRecord(${args}) { ${updateResolver}(${vars}) { ${fields} } }`,
    },
    delete: {
      resolver: deleteResolver,
      query: `mutation deleteRecord(${idArg}) { ${deleteResolver}(${idVar}) }`,
    },
  };
};

export const queryCsvTemplate: QueryCsvTemplate = (modelName) => {
  const { nameCp } = getInflections(modelName);

  const resolver = `csvTableTemplate${nameCp}`;
  const query = `query {${resolver}}`;

  return {
    resolver,
    query,
  };
};

export const queryBulkCreate: QueryBulkCreate = (modelName) => {
  const { nameCp } = getInflections(modelName);

  const resolver = `bulkAdd${nameCp}Csv`;
  const query = `mutation {${resolver}}`;
  return {
    resolver,
    query,
  };
};

/**
 * Parse attributes to compose query and mutation strings:
 * -  idArg: id argument as required in the read and delete functions.
 * -  idVar: id variable as required in the read query and delete mutation.
 * -   args: all arguments as required in the add and update functions.
 * -   vars: all variables as required in the add and update mutations.
 * - fields: all attribute fields.
 * @param attributes raw attribute array
 */
function parseQueryAttributes(
  attributes: ParsedAttribute[]
): {
  args: string;
  idArg: string;
  idVar: string;
  fields: string;
  vars: string;
} {
  return {
    /**
     * Get all arguments as required in the add and update functions.
     */
    get args() {
      return attributes
        .map(({ name, type, primaryKey }) =>
          primaryKey ? `$${name}: ID!` : `$${name}: ${type}`
        )
        .join(' ');
    },

    /**
     * Get the primary argument as required in the read and delete functions.
     */
    get idArg() {
      const attr = attributes.find(({ primaryKey }) => primaryKey);
      if (!attr)
        throw new Error(
          'A primary key is required to build read and delete queries'
        );
      return `$${attr.name}: ID!`;
    },

    /**
     * Get the id variable as required in the read query and delete mutation.
     */
    get idVar() {
      const attr = attributes.find(({ primaryKey }) => primaryKey);
      if (!attr)
        throw new Error(
          'A primary key is required to build read and delete queries'
        );
      return `${attr.name}: $${attr.name}`;
    },

    /**
     * Get all attribute fields.
     */
    get fields() {
      return attributes.map(({ name }) => name).join(' ');
    },

    /**
     * Get all variables as required in the add and update mutations.
     */
    get vars() {
      return attributes.map(({ name }) => `${name}: $${name}`).join(' ');
    },
  };
}
