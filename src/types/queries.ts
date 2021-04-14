import { AttributeScalarType, ParsedAttribute } from '@/types/models';

export interface QueryVariables {
  [key: string]: unknown;
}

export interface RawQuery {
  name: string;
  query: string;
  resolver: string;
  attributes: ParsedAttribute[];
  transform?: string;
  assocResolver?: string;
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
