import {
  ApiPrivileges,
  Association,
  DataModel,
  ParsedAssociation,
  ParsedAttribute,
  StorageType,
} from '@/types/models';

/**
 * Get all foreign keys for a given model. A foreign-key is understood as any attribute that
 * is contained in the given data model and is referenced by another model to define an association
 * between the two.
 * @param dataModel the data model object to parse
 */
export function getForeignKeys(dataModel: DataModel): Set<string> {
  const { associations, model } = dataModel;
  const foreignKeys = new Set<string>();

  /**
   * Parser function that iterates over data model associations and returns foreign-key
   * attributes that contained in the data model.
   * @param keys a Set object containing foreign keys
   * @param param1 each Association object
   */
  const parseAssociationsReducer = (
    keys: Set<string>,
    { keysIn, targetKey, sourceKey, type }: Association
  ): Set<string> => {
    if (keysIn === model) {
      switch (type) {
        case 'one_to_one':
        case 'many_to_one':
          return keys.add(targetKey);
        case 'many_to_many':
          return sourceKey ? keys.add(sourceKey) : keys;
        default:
          throw new Error(
            `Parsing foreign keys is not supported for association type ${type} in model ${model}.`
          );
      }
    }
    return keys;
  };

  if (associations) {
    Object.values(associations).reduce(parseAssociationsReducer, foreignKeys);
  }

  return foreignKeys;
}

/**
 * Read raw associations into a parsed array.
 * @param model parsed data model object
 */
export function parseAssociations(model: DataModel): ParsedAssociation[] {
  let parsedAssociations: ParsedAssociation[] = [];

  if (model.associations) {
    parsedAssociations = Object.entries(model.associations).map(
      ([name, values]) => ({
        name,
        ...values,
      })
    );
  }

  return parsedAssociations;
}

export function parseAttributes(
  model: DataModel,
  options?: {
    excludeForeignKeys: boolean;
  }
): { [name: string]: ParsedAttribute } {
  // Get the model foreign keys
  const foreignKeys = getForeignKeys(model);

  // Parse the model attributes
  let hasInternalId = false;
  const attributes = Object.entries(model.attributes).reduce<{
    [name: string]: ParsedAttribute;
  }>((attrs, [name, type]) => {
    const primaryKey = model.internalId === name;
    const foreignKey = foreignKeys.has(name);

    if (primaryKey) hasInternalId = true;
    if (options?.excludeForeignKeys && foreignKey) return attrs;

    return {
      ...attrs,
      [name]: {
        name,
        type,
        primaryKey,
        foreignKey,
      },
    };
  }, {});

  // Sort or unshift the id attribute
  let sortedAttributes: typeof attributes;
  if (hasInternalId) {
    sortedAttributes = Object.fromEntries(
      Object.entries(
        attributes
      ).sort(([, parsedAttribute1], [, parsedAttribute2]) =>
        parsedAttribute1.primaryKey ? -1 : parsedAttribute2.primaryKey ? 1 : 0
      )
    );
  } else {
    sortedAttributes = {
      id: {
        name: 'id',
        type: 'Int',
        primaryKey: true,
        automaticId: true,
      },
      ...attributes,
    };
  }

  return sortedAttributes;
}

/**
 * Depending on the storageType the model might have some restrictions on certain aspects of the zendro API (search, order, paginate).
 * This function returns those privileges
 *
 * @param storageType storageType of the model
 * @returns Api priviledges
 */
export function getModelApiPrivileges(storageType: StorageType): ApiPrivileges {
  const defaultPrivileges = {
    operators: [
      'like',
      'notLike',
      'or',
      'and',
      'eq',
      'between',
      'notBetween',
      'in',
      'notIn',
      'gt',
      'gte',
      'lt',
      'lte',
      'ne',
      'regexp',
      'notRegexp',
      'contains',
      'contained',
      'not',
      'all',
    ],
    backwardPagination: true,
    sort: true,
    create: true,
    update: true,
    delete: true,
    bulkAddCsv: true,
    textSearch: true,
  } as ApiPrivileges;

  switch (storageType) {
    case 'cassandra':
      return {
        operators: ['eq', 'lt', 'gt', 'lte', 'gte', 'in', 'contains', 'and'],
        backwardPagination: false,
        sort: false,
        create: true,
        update: true,
        delete: true,
        bulkAddCsv: false,
        textSearch: false,
      };
    case 'amazon-s3':
      return {
        operators: [
          'eq',
          'ne',
          'lt',
          'gt',
          'lte',
          'gte',
          'like',
          'and',
          'or',
          'not',
          'between',
          'in',
        ],
        backwardPagination: false,
        sort: false,
        create: false,
        update: false,
        delete: false,
        bulkAddCsv: true,
        textSearch: true,
      };
    case 'trino':
    case 'presto':
      return {
        operators: [
          'eq',
          'ne',
          'lt',
          'gt',
          'lte',
          'gte',
          'like',
          'and',
          'or',
          'not',
          'between',
          'in',
        ],
        backwardPagination: true,
        sort: true,
        create: false,
        update: false,
        delete: false,
        bulkAddCsv: false,
        textSearch: true,
      };
    case 'mongodb':
      return {
        ...defaultPrivileges,
        operators: [
          'or',
          'and',
          'not',
          'all',
          'eq',
          'ne',
          'in',
          'notIn',
          'gt',
          'gte',
          'lt',
          'lte',
          'regexp',
        ],
      };
    case 'neo4j':
      return {
        ...defaultPrivileges,
        operators: [
          'eq',
          'ne',
          'lt',
          'gt',
          'lte',
          'gte',
          'regexp',
          'contains',
          'and',
          'or',
          'not',
          'in',
        ],
      };
    default:
      return defaultPrivileges;
  }
}

/* DEPRECATED */

export function getAttributeList(
  model: DataModel,
  options?: {
    excludeForeignKeys: boolean;
  }
): Array<ParsedAttribute> {
  // Get an array of Attribute objects
  const foreignKeys = getForeignKeys(model);
  let attributes: Array<ParsedAttribute> = Object.keys(model.attributes).map(
    (attribute) => {
      return {
        name: attribute,
        type: model.attributes[attribute],
        primaryKey: model.internalId === attribute,
        foreignKey: foreignKeys.has(attribute),
      };
    }
  );

  // Parse all attributes contained in associated models
  if (options?.excludeForeignKeys) {
    attributes = attributes.filter(({ foreignKey }) => !foreignKey);
  }

  // Sort or unshift the id attribute
  model.internalId
    ? attributes.splice(
        0,
        0,
        attributes.splice(
          attributes.findIndex((attr) => {
            return attr.name === model.internalId;
          }),
          1
        )[0]
      )
    : attributes.unshift({
        name: 'id',
        type: 'Int',
        primaryKey: true,
        automaticId: true,
      });

  return attributes;
}
