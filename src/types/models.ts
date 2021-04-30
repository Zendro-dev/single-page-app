/* ATTRIBUTES */

import { Assign } from 'utility-types';

export type AttributeScalarType =
  | 'Boolean'
  | 'DateTime'
  | 'Float'
  | 'Int'
  | 'String'
  | 'Array';

export type AttributeArrayType =
  | '[Boolean]'
  | '[DateTime]'
  | '[Float]'
  | '[Int]'
  | '[String]';

export interface Attributes {
  [key: string]: AttributeScalarType | AttributeArrayType;
}

export type AttributeValue = AttributeScalarValue | AttributeArrayValue;

export type AttributeScalarValue = boolean | Date | number | string | null;

export type AttributeArrayValue =
  | boolean[]
  | Date[]
  | number[]
  | string[]
  | null[]
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

export type DataRecordWithAssoc = DataRecord & Record<string, DataRecord>;

/* ASSOCIATIONS */

export type AssociationType =
  | 'to_one'
  | 'to_many'
  | 'to_many_through_sql_cross_table';

export interface Association {
  type: AssociationType;
  reverseAssociationType?: AssociationType;
  targetStorageType: 'sql';
  target: string;
  targetKey: string;
  sourceKey?: string;
  keyIn?: string;
  keysIn?: string;
  label?: string;
  sublabel?: string;
}

export interface ParsedAssociation extends Association {
  name: string;
}

export interface ParsedAssociation2 extends Association {
  name: string;
  reverseAssociationType: AssociationType;
}

/* DATA MODELS */

export interface DataModel {
  associations?: Record<string, Association>;
  attributes: Attributes;
  internalId?: string;
  model: string;
  storageType: 'sql';
}

export interface ParsedDataModel extends DataModel {
  primaryKey: string;
}

export type ParsedDataModel2 = Assign<
  DataModel,
  {
    associations?: ParsedAssociation[];
    attributes: ParsedAttribute[];
    primaryKey: string;
  }
>;

export type ParsedDataModel3 = Assign<
  DataModel,
  {
    associations?: Record<string, ParsedAssociation2>;
    attributes: Record<string, ParsedAttribute>;
    primaryKey: string;
  }
>;
