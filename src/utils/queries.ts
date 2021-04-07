import { getInflections } from '@/utils/inflection';
import { ParsedAttribute } from '@/types/models';
import { RawQuery } from '@/types/queries';

export const queryBulkCreate = (modelName: string): RawQuery => {
  const { nameCp } = getInflections(modelName);

  const resolver = `bulkAdd${nameCp}Csv`;
  const query = `mutation {${resolver}}`;
  return {
    name: resolver,
    query,
    resolver,
  };
};

export const queryCsvTemplate = (modelName: string): RawQuery => {
  const { nameCp } = getInflections(modelName);

  const resolver = `csvTableTemplate${nameCp}`;
  const query = `query {${resolver}}`;

  return {
    name: resolver,
    query,
    resolver,
  };
};

export const queryRecord = (
  modelName: string,
  attributes: ParsedAttribute[]
): {
  primaryKey: string;
  create: RawQuery;
  read: RawQuery;
  update: RawQuery;
  delete: RawQuery;
} => {
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
      name: createResolver,
      resolver: createResolver,
      query: `mutation ${createResolver}(${args}) { ${createResolver}(${vars}) { ${fields} } }`,
    },
    read: {
      name: readResolver,
      resolver: readResolver,
      query: `query ${readResolver}(${idArg}) { ${readResolver}(${idVar}) { ${fields} } }`,
    },
    update: {
      name: updateResolver,
      resolver: updateResolver,
      query: `mutation ${updateResolver}(${args}) { ${updateResolver}(${vars}) { ${fields} } }`,
    },
    delete: {
      name: deleteResolver,
      resolver: deleteResolver,
      query: `mutation ${deleteResolver}(${idArg}) { ${deleteResolver}(${idVar}) }`,
    },
  };
};

/**
 * Compose a readMany graphql query to retrieve a list of model records.
 * @param modelName name of the data model to query data from
 * @param attributes a sorted list of attribute fields to query
 */
export const queryRecords = (
  modelName: string,
  attributes: ParsedAttribute[]
): RawQuery => {
  const { nameCp, namePlCp, namePlLc } = getInflections(modelName);
  const { fields } = parseQueryAttributes(attributes);

  const queryName = `read${namePlCp}`;
  const resolver = `${namePlLc}Connection`;

  const query = `query ${queryName}(
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
    name: queryName,
    resolver,
    query,
  };
};

export const queryRecordsCount = (modelName: string): RawQuery => {
  const { nameCp, namePlCp } = getInflections(modelName);
  const resolver = `count${namePlCp}`;
  const query = `query ${resolver}($search: search${nameCp}Input) {
    ${resolver}( search: $search )
  }`;

  return {
    name: resolver,
    resolver: resolver,
    query,
  };
};

export const queryRecordsWithToMany = (
  modelName: string,
  modelAttributes: ParsedAttribute[],
  assocModelName: string,
  assocPrimaryKey: string
): RawQuery => {
  const {
    nameCp: assocNameCp,
    namePlCp: assocNamePlCp,
    namePlLc: assocNamePlLc,
  } = getInflections(assocModelName);

  const {
    nameCp: modelNameCp,
    namePlCp: modelNamePlCp,
    namePlLc: modelNamePlLc,
  } = getInflections(modelName);

  const modelResolver = `${modelNamePlLc}Connection`;
  const { fields } = parseQueryAttributes(modelAttributes);

  const queryName = `read${modelNamePlCp}With${assocNamePlCp}`;
  const query = `query ${queryName}(
    $order: [order${modelNameCp}Input]
    $search: search${modelNameCp}Input
    $pagination: paginationCursorInput!
    $assocOrder: [order${assocNameCp}Input]
    $assocSearch: search${assocNameCp}Input
    $assocPagination: paginationCursorInput!
  ) {
    ${modelResolver}( order: $order search: $search, pagination: $pagination ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          ${fields}
          ${assocNamePlLc}Connection( order: $assocOrder search: $assocSearch, pagination: $assocPagination ) {
            edges{
              node {
                ${assocPrimaryKey}
              }
            }
          }
        }
      }
    }
  }`;

  return {
    name: queryName,
    resolver: modelResolver,
    query,
  };
};

export const queryRecordsWithToOne = (
  modelName: string,
  modelAttributes: ParsedAttribute[],
  assocName: string,
  assocModelName: string,
  assocPrimaryKey: string
): RawQuery => {
  const { nameCp: assocNameCp } = getInflections(assocModelName);

  const {
    namePlLc: modelNamePlLc,
    nameCp: modelNameCp,
    namePlCp: modelNamePlCp,
  } = getInflections(modelName);

  const { fields: modelFields } = parseQueryAttributes(modelAttributes);
  const modelResolver = `${modelNamePlLc}Connection`;
  const queryName = `read${modelNamePlCp}With${assocNameCp}`;

  const query = `query ${queryName} (
    $order: [order${modelNameCp}Input]
    $search: search${modelNameCp}Input
    $pagination: paginationCursorInput!
    $assocSearch: search${assocNameCp}Input
  ) {
    ${modelResolver}( order: $order search: $search, pagination: $pagination ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          ${modelFields}
          ${assocName}( search: $assocSearch ) {
            ${assocPrimaryKey}
          }
        }
      }
    }
  }`;

  return {
    name: queryName,
    resolver: modelResolver,
    query,
    transform:
      '.data.countriesConnection.pageInfo as $pageInfo' +
      ' | .data.countriesConnection.edges' +
      ' | map(.node) as $records' +
      ' | { data: { $pageInfo, $records } }',
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
