import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecords,
  QueryCsvTemplate,
  QueryBulkCreate,
  QueryRecord,
  QueryModelTableRecordsCount,
  QueryModeTableAssociationRecords,
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

/*
FILTERS:
## assocs
to_one: getOneAssociatedRecords(model, associatedModel)
to_many: getManyAssociatedRecords(model,associatedModel)

getNotAssociated(model, associatedModel)

## mark
getMarkedForAssociation(model, list)

QUERIES
to_one:  readAllAssociationFilterOne(model, associatedModel)
to_many: readAllAssociationFilterMany(model, associatedModel, filterKey)

The parsing does not need to be any different from the standard case. fieldResolvers will not be displayed anyways, the row uses attributes to ensure correct order
special parsing is needed for he fieldResolver (also different for to_one, to_many).

#utility
parseAssociated(response, isConnection) - return list of associated. Use to pass isAssociated to the row
 */

export const queryModelTableAssociationRecordsToOne: QueryModeTableAssociationRecords = (
  rootModelName,
  rootAttributes,
  fieldModelName,
  fieldAttribute
) => {
  const { namePlLc: rootNamePlLc, nameCp: rootNameCp } = getInflections(
    rootModelName
  );
  const { nameCp: fieldNameCp } = getInflections(fieldModelName);

  const rootResolver = `${rootNamePlLc}Connection`;
  const fieldResolver = fieldModelName;

  const { fields } = parseQueryAttributes(rootAttributes);

  const query = `query getModelTableOneAssociationRecords(
    $order: [order${rootNameCp}Input]
    $search: search${rootNameCp}Input
    $pagination: paginationCursorInput!
    $fieldSearch: search${fieldNameCp}Input
  ) {
    ${rootResolver}( order: $order search: $search, pagination: $pagination ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node { 
          ${fields}
          ${fieldResolver}( search: $fieldSearch ) {
            ${fieldAttribute}
          }
        }
      }
    }
  }`;

  return {
    resolver: rootResolver,
    // fieldResolver,
    query,
  };
};

export const queryModelTableAssociationRecordsToMany: QueryModeTableAssociationRecords = (
  rootModelName,
  rootAttributes,
  fieldModelName,
  fieldAttribute
) => {
  const { namePlLc: rootNamePlLc, nameCp: rootNameCp } = getInflections(
    rootModelName
  );
  const { namePlLc: fieldNamePlLc, nameCp: fieldNameCp } = getInflections(
    fieldModelName
  );

  const rootResolver = `${rootNamePlLc}Connection`;
  const fieldResolver = `${fieldNamePlLc}Connection`;

  const { fields } = parseQueryAttributes(rootAttributes);

  const query = `query getModelTableManyAssociationRecords(
    $rootOrder: [order${rootNameCp}Input]
    $rootSearch: search${rootNameCp}Input
    $rootPagination: paginationCursorInput!
    $fieldOrder: [order${fieldNameCp}Input]
    $fieldSearch: search${fieldNameCp}Input
    $fieldPagination: paginationCursorInput
  ) {
    ${rootResolver}( order: $rootOrder search: $rootSearch, pagination: $rootPagination ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node { 
          ${fields}
          ${fieldResolver}( order: $fieldOrder search: $fieldSearch, pagination: $fieldPagination ) {
            edges{
              node {
                ${fieldAttribute}
              }
            }
          }
        }
      }
    }
  }`;

  return {
    resolver: rootResolver,
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

// function parseAssociatedConnection(data, rootResolver, fieldResolver) {

// }
