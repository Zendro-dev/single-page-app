import { ParsedUrlQuery } from 'querystring';

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
}

/* ASSOCIATIONS */

export interface Association {
  type: 'to_one' | 'to_many';
  target: string;
  targetKey: string;
  keyIn: string;
  targetStorageType: 'sql';
  label: string;
}

export interface Associations {
  [key: string]: Association;
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

/* STATIC TYPES */

export interface PathParams extends ParsedUrlQuery {
  model: string;
}

export interface RecordPathParams extends PathParams {
  create?: string;
  read?: string;
  update?: string;
}
