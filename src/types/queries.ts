import { ParsedAttribute, AttributeScalarType } from '@/types/models';

export interface QueryVariables {
  [key: string]: unknown;
}

export interface RawQuery {
  resolver: string;
  query: string;
}

export interface ComposedQuery<V = QueryVariables | null | undefined>
  extends RawQuery {
  variables: V;
}

/**
 * MODEL
 */
export interface QueryVariableSearch {
  field?: string;
  value?: string;
  valueType?: AttributeScalarType;
  // TODO operator types
  operator?: string;
  // TODO recursive search
  search?: QueryVariableSearch[];
}

export type OrderDirection = 'ASC' | 'DESC';

export interface QueryVariableOrder {
  field: string;
  order: OrderDirection;
}

export interface QueryVariablePagination {
  first?: number;
  last?: number;
  after?: string | null;
  before?: string | null;
  includeCursor?: boolean;
}

export interface QueryModelTableRecordsVariables extends QueryVariables {
  search?: QueryVariableSearch;
  pagination: QueryVariablePagination;
  order?: QueryVariableOrder;
}

export interface QueryModelTableRecordsCountVariables {
  search?: QueryVariableSearch;
}

export type QueryModelTableRecords = (
  modelName: string,
  attributes: ParsedAttribute[]
) => RawQuery;

export type QueryModelTableRecordsCount = (modelName: string) => RawQuery;

export type QueryCsvTemplate = (modelName: string) => RawQuery;

export type QueryBulkCreate = (modelName: string) => RawQuery;

/**
 * RECORD
 */
export type QueryRecord = (
  modelName: string,
  attributes: ParsedAttribute[]
) => {
  primaryKey: string;
  create: RawQuery;
  read: RawQuery;
  update: RawQuery;
  delete: RawQuery;
};
