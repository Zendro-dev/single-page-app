import { AttributeScalarType } from '@/types/models';

export interface QueryVariables {
  [key: string]: unknown;
}

export interface RawQuery {
  name: string;
  query: string;
  resolver: string;
  transform?: string;
}

export interface AssocQuery extends RawQuery {
  assocResolver: string;
}

/**
 * MODEL
 */

export type Operator =
  | 'like'
  | 'notLike'
  | 'iLike'
  | 'notILike'
  | 'regexp'
  | 'iRegexp'
  | 'notIRegexp'
  | 'notRegexp'
  | 'eq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'ne'
  | 'between'
  | 'notBetween'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'notContains'
  | 'or'
  | 'and'
  | 'not';

export interface QueryVariableSearch {
  field?: string;
  value?: string;
  valueType?: AttributeScalarType;
  // TODO operator types
  operator?: Operator;
  // TODO recursive search
  search?: (QueryVariableSearch | undefined)[];
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

// TODO separate into two different interfaces for records/count
export interface QueryModelTableRecordsVariables extends QueryVariables {
  search?: QueryVariableSearch;
  pagination?: QueryVariablePagination;
  order?: QueryVariableOrder;
  assocSearch?: QueryVariableSearch;
  assocPagination?: QueryVariablePagination;
}
