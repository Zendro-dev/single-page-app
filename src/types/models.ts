/* ATTRIBUTES */

export type AttributeScalarType =
  | 'Boolean'
  | 'DateTime'
  | 'Float'
  | 'Int'
  | 'String';

export type AttributeArrayType =
  | '[Boolean]'
  | '[DateTime]'
  | '[Float]'
  | '[Int]'
  | '[String]';

export interface Attributes {
  [key: string]: AttributeScalarType | AttributeArrayType;
}

export type AttributeValue =
  | boolean
  | boolean[]
  | Date
  | Date[]
  | number
  | number[]
  | string
  | string[]
  | null;

export interface ParsedAttribute {
  name: string;
  type: AttributeScalarType | AttributeArrayType;
  primaryKey?: boolean;
  foreignKey?: boolean;
  automaticId?: boolean;
}

export interface DataRecord {
  [key: string]: AttributeValue;
}

/* ASSOCIATIONS */

export interface Association {
  type: 'to_one' | 'to_many' | 'to_many_through_sql_cross_table';
  target: string;
  targetKey: string;
  sourceKey?: string;
  keyIn?: string;
  keysIn?: string;
  targetStorageType: 'sql';
  label: string;
  sublabel?: string;
}

export interface Associations {
  [key: string]: Association;
}

export interface ParsedAssociation extends Association {
  name: string;
}

/* DATA MODELS */

export interface DataModel {
  model: string;
  storageType: 'sql';
  attributes: Attributes;
  associations?: Associations;
  internalId: keyof Attributes;
}

export interface DataModels {
  [key: string]: DataModel;
}
