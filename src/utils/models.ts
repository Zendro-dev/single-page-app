import {
  Association,
  AttributeScalarType,
  AttributeArrayType,
  DataModel,
} from '@/types/models';

/**
 * Get all foreign keys for a given model. A foreign-key is understood as any attribute that
 * is contained in any of the associated data models.
 * @param dataModel the data model object to parse
 */
export function getForeignKeys(dataModel: DataModel): Set<string> {
  const { attributes, associations, model } = dataModel;
  const foreignKeys = new Set<string>();

  /**
   * Parser function that iterates over data model associations and returns foreign-key
   * attributes that are not contained in the data model.
   * @param keys a Set object containing foreign keys
   * @param param1 each Association object
   */
  const parseAssociationsReducer = (
    keys: Set<string>,
    { keyIn, targetKey }: Association
  ): Set<string> =>
    attributes[targetKey] && keyIn !== model ? keys.add(targetKey) : keys;

  if (associations) {
    Object.values(associations).reduce(parseAssociationsReducer, foreignKeys);
  }

  return foreignKeys;
}

export interface Attribute {
  name: string;
  type: AttributeScalarType | AttributeArrayType;
  readOnly: boolean;
}

interface GetAttributeListOptions {
  excludeForeignKeys: boolean;
}

export function getAttributeList(
  model: DataModel,
  options?: GetAttributeListOptions
): Array<Attribute> {
  // Get an array of Attribute objects
  const attributes: Array<Attribute> = Object.keys(model.attributes).map(
    (attribute) => {
      return {
        name: attribute,
        type: model.attributes[attribute],
        readOnly: model.internalId === attribute ? true : false,
      };
    }
  );

  // Parse all attributes contained in associated models
  if (options?.excludeForeignKeys) {
    const foreignKeys = getForeignKeys(model);
    attributes.filter(({ name }) => foreignKeys.has(name));
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
    : attributes.unshift({ name: 'id', type: 'Int', readOnly: true });

  return attributes;
}
