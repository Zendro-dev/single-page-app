import { ParsedUrlQuery } from 'querystring';

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
  | number
  | number[]
  | string
  | string[]
  | null;

export interface AttributeMap {
  Boolean: boolean;
  DateTime: Date;
  Float: number;
  Int: number;
  String: number;
  '[Boolean]': boolean[];
  '[DateTime]': Date[];
  '[Float]': number[];
  '[Int]': number[];
  '[String]': string[];
}

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

export interface PathParams extends ParsedUrlQuery {
  model: string;
}
