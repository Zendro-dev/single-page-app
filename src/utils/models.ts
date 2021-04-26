import {
  Association,
  DataModel,
  ParsedAssociation,
  ParsedAssociation2,
  ParsedAttribute,
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
    { keyIn, targetKey, sourceKey, type }: Association
  ): Set<string> => {
    if (keyIn === model) {
      switch (type) {
        case 'to_one':
          return keys.add(targetKey);
        case 'to_many':
          return sourceKey ? keys.add(sourceKey) : keys;
        default:
          return keys;
      }
    }
    return keys;
  };

  if (associations) {
    Object.values(associations).reduce(parseAssociationsReducer, foreignKeys);
  }

  return foreignKeys;
}

export function parseAssociations2(
  sourceModel: DataModel,
  dataModels: Record<string, DataModel>
): Record<string, ParsedAssociation2> | undefined {
  const associations = sourceModel.associations;
  if (!associations) return undefined;

  const parsedAssociations = Object.entries(associations).reduce<{
    [name: string]: ParsedAssociation2;
  }>((acc, [assocName, association]) => {
    // Check whether the target model exists in the provided data models
    const targetModel = dataModels[association.target];
    if (!targetModel)
      throw new Error(
        `Model "${association.target}" was not found, ` +
          `but it is listed as a target in "${sourceModel.model}.${assocName}".`
      );

    // Check whether the target model has associations defined
    const targetAssociations = targetModel.associations;
    if (!targetAssociations)
      throw new Error(
        `Model "${targetModel}" does not have associations defined, ` +
          `but it is listed as a target in "${sourceModel.model}.${assocName}".`
      );

    // Check whether the reverse association exists in the target model
    const reverseAssociation = Object.values(targetAssociations).find(
      ({ target }) => target === sourceModel.model
    );
    if (!reverseAssociation)
      throw new Error(
        `The target model "${targetModel.model}" does not have an association ` +
          `with "${sourceModel.model}" defined as target, ` +
          `but it is listed as a target in "${sourceModel.model}.${assocName}".`
      );

    return {
      ...acc,
      [assocName]: {
        ...association,
        name: assocName,
        reverseAssociationType: reverseAssociation.type,
      },
    };
  }, {});

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
