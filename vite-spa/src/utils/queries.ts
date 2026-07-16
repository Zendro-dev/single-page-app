import { getInflections } from '@/utils/inflection';
import { ParsedAssociation, ParsedAttribute } from '@/types/models';
import { AssocQuery, RawQuery } from '@/types/queries';

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
  attributes: ParsedAttribute[],
  associations: ParsedAssociation[] = []
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

  const { args, argsNoAutoId, idArg, idVar, fields, vars, varsNoAutoId } =
    parseQueryAttributes(attributes);

  const { assocArgs, assocVars, assocCreateArgs, assocCreateVars } =
    associations
      ? parseQueryAssociations(associations)
      : {
          assocArgs: '',
          assocVars: '',
          assocCreateArgs: '',
          assocCreateVars: '',
        };

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
      query: `mutation ${createResolver}(${argsNoAutoId} ${assocCreateArgs}) { ${createResolver}(${varsNoAutoId} ${assocCreateVars}) { ${fields} asCursor} }`,
    },
    read: {
      name: readResolver,
      resolver: readResolver,
      query: `query ${readResolver}(${idArg}) { ${readResolver}(${idVar}) { ${fields} } }`,
    },
    update: {
      name: updateResolver,
      resolver: updateResolver,
      query: `mutation ${updateResolver}(${args} ${assocArgs}) { ${updateResolver}(${vars} ${assocVars}) { ${fields} } }`,
    },
    delete: {
      name: deleteResolver,
      resolver: deleteResolver,
      query: `mutation ${deleteResolver}(${idArg}) { ${deleteResolver}(${idVar}) }`,
    },
  };
};

export const readOneRecordWithAssoc = (
  modelName: string,
  attributes: ParsedAttribute[],
  assocName: string,
  assocModelName: string,
  associationAttributes: ParsedAttribute[]
): {
  readOneRecordWithToMany: AssocQuery;
  readOneRecordWithToOne: AssocQuery;
  readOneRecordWithAssocCount: AssocQuery;
} => {
  const { nameCp: modelNameCp } = getInflections(modelName);
  const { nameCp: assocModelNameCp } = getInflections(assocModelName);
  const { nameCp: assocNameCp, nameLc: assocNameLc } =
    getInflections(assocName);
  const readResolver = `readOne${modelNameCp}`;

  const { idArg, idVar } = parseQueryAttributes(attributes);
  const { fields } = parseQueryAttributes(associationAttributes);

  /* TO MANY */
  const assocResolverToMany = `${assocNameLc}Connection`;
  const queryNameToMany = `readOne${modelNameCp}With${assocNameCp}`;
  const queryToMany = `
  query ${readResolver}(
    ${idArg}
    $order: [order${assocModelNameCp}Input]
    $search: search${assocModelNameCp}Input
    $pagination: paginationCursorInput!) { ${readResolver}(${idVar}) {
    ${assocResolverToMany} ( order: $order search: $search, pagination: $pagination ) {
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
  } }
  `;

  /* TO ONE */
  const queryNameToOne = `readOne${modelNameCp}With${assocName}`;
  const queryToOne = `
  query ${readResolver}(${idArg} $search: search${assocModelNameCp}Input) { ${readResolver}(${idVar}) {
    ${assocName}(search: $search){
      ${fields}
    }
  } }
  `;

  /* COUNT */
  const queryNameCount = `readOne${modelNameCp}With${assocNameCp}Count`;
  const countResolver = `countFiltered${assocNameCp}`;
  const queryCount = `
  query ${readResolver}(${idArg} $search: search${assocModelNameCp}Input) { ${readResolver}(${idVar}) {
   ${countResolver} (search: $search)
  } }
  `;

  return {
    readOneRecordWithToOne: {
      name: queryNameToOne,
      resolver: readResolver,
      assocResolver: assocName,
      query: queryToOne,
      transform:
        `.${readResolver}` +
        ` | (if .${assocName} then map({${fields
          .split(' ')
          .map((field) => `"${field}"`)
          .join(',')}}) else [] end) as $records ` +
        ` | { $records }`,
    },
    readOneRecordWithToMany: {
      name: queryNameToMany,
      resolver: readResolver,
      assocResolver: assocResolverToMany,
      query: queryToMany,
      transform:
        `.${readResolver}.${assocResolverToMany}.pageInfo as $pageInfo` +
        ` | .${readResolver}.${assocResolverToMany}.edges` +
        ' | map(.node) as $records' +
        ' | { $pageInfo, $records }',
    },
    readOneRecordWithAssocCount: {
      name: queryNameCount,
      resolver: readResolver,
      assocResolver: countResolver,
      query: queryCount,
      transform: `.${readResolver}.${countResolver} as $count | { $count }`,
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
    transform:
      `.${resolver}.pageInfo as $pageInfo` +
      ` | .${resolver}.edges` +
      ' | map(.node) as $records' +
      ' | {  $pageInfo, $records  }',
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
    transform: `.${resolver} as $count |  { $count }`,
  };
};

export const queryRecordsWithToMany = (
  modelName: string,
  modelAttributes: ParsedAttribute[],
  assocName: string,
  assocModelName: string,
  assocPrimaryKey: string
): AssocQuery => {
  const {
    nameCp: modelNameCp,
    namePlCp: modelNamePlCp,
    namePlLc: modelNamePlLc,
  } = getInflections(modelName);

  const { nameCp: assocModelNameCp } = getInflections(assocModelName);

  const { namePlCp: assocNamePlCp, nameLc: assocNameLc } =
    getInflections(assocName);

  const modelResolver = `${modelNamePlLc}Connection`;
  const assocResolver = `${assocNameLc}Connection`;
  const { fields } = parseQueryAttributes(modelAttributes);

  const queryName = `read${modelNamePlCp}With${assocNamePlCp}`;
  const query = `query ${queryName}(
    $order: [order${modelNameCp}Input]
    $search: search${modelNameCp}Input
    $pagination: paginationCursorInput!
    $assocOrder: [order${assocModelNameCp}Input]
    $assocSearch: search${assocModelNameCp}Input
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
          ${assocResolver}( order: $assocOrder search: $assocSearch, pagination: $assocPagination ) {
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
    assocResolver,
    transform:
      `.${modelResolver}.pageInfo as $pageInfo` +
      ` | .${modelResolver}.edges | map(.node)` +
      ` | map(with_entries(select(.key != "${assocResolver}"))` +
      ` + {${assocResolver}: .${assocResolver}.edges | map(.node)[0]}) as $records` +
      ' | {  $pageInfo, $records  }',
  };
};

export const queryRecordsWithToOne = (
  modelName: string,
  modelAttributes: ParsedAttribute[],
  assocName: string,
  assocModelName: string,
  assocPrimaryKey: string
): AssocQuery => {
  const { nameCp: assocModelNameCp } = getInflections(assocModelName);
  const { nameCp: assocNameCp } = getInflections(assocName);

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
    $assocSearch: search${assocModelNameCp}Input
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
    assocResolver: assocName,
    transform:
      ` .${modelResolver}.pageInfo as $pageInfo` +
      ` | .${modelResolver}.edges` +
      ' | map(.node) as $records' +
      ' | { $pageInfo, $records }',
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
function parseQueryAttributes(attributes: ParsedAttribute[]): {
  args: string;
  argsNoAutoId: string;
  idArg: string;
  idVar: string;
  fields: string;
  vars: string;
  varsNoAutoId: string;
} {
  return {
    /**
     * Get all arguments as required in the update function.
     */
    get args() {
      return attributes
        .map(({ name, type, primaryKey }) =>
          primaryKey ? `$${name}: ID!` : `$${name}: ${type}`
        )
        .join(' ');
    },

    /**
     * Get all arguments as required in the add function.
     */
    get argsNoAutoId() {
      return attributes
        .map(({ name, type, primaryKey, automaticId }) =>
          automaticId ? '' : primaryKey ? `$${name}: ID!` : `$${name}: ${type}`
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
     * Get all variables as required in the update mutation.
     */
    get vars() {
      return attributes.map(({ name }) => `${name}: $${name}`).join(' ');
    },

    /**
     * Get all variables as required in the add mutation.
     */
    get varsNoAutoId() {
      return attributes
        .map(({ name, automaticId }) =>
          automaticId ? '' : `${name}: $${name}`
        )
        .join(' ');
    },
  };
}

function parseQueryAssociations(associations: ParsedAssociation[]): {
  assocArgs: string;
  assocVars: string;
  assocCreateArgs: string;
  assocCreateVars: string;
} {
  return {
    get assocArgs() {
      return associations
        .reduce((acc: string[], curr) => {
          const { nameCp: mutationName } = getInflections(curr.name);
          acc.push(
            `$add${mutationName}: ${
              curr.type.includes('to_one') ? 'ID' : '[ID]'
            }`
          );
          acc.push(
            `$remove${mutationName}: ${
              curr.type.includes('to_one') ? 'ID' : '[ID]'
            }`
          );
          return acc;
        }, [])
        .join(' ');
    },

    get assocVars() {
      return associations
        .reduce((acc: string[], curr) => {
          const { nameCp: mutationName } = getInflections(curr.name);
          acc.push(`add${mutationName}: $add${mutationName}`);
          acc.push(`remove${mutationName}: $remove${mutationName}`);
          return acc;
        }, [])
        .join(' ');
    },

    get assocCreateArgs() {
      return associations
        .reduce((acc: string[], curr) => {
          const { nameCp: mutationName } = getInflections(curr.name);
          acc.push(
            `$add${mutationName}: ${
              curr.type.includes('to_one') ? 'ID' : '[ID]'
            }`
          );
          return acc;
        }, [])
        .join(' ');
    },

    get assocCreateVars() {
      return associations
        .reduce((acc: string[], curr) => {
          const { nameCp: mutationName } = getInflections(curr.name);
          acc.push(`add${mutationName}: $add${mutationName}`);
          return acc;
        }, [])
        .join(' ');
    },
  };
}
