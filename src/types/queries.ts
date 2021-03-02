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

export interface QueryModelTableRecordsVariables extends QueryVariables {
  search?: {
    field: string;
    value: string;
    valueType: AttributeScalarType;
  };
  pagination: {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
    includeCursor?: boolean;
  };
  order?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
}
export type QueryModelTableRecords = (
  modelName: string,
  attributes: ParsedAttribute[],
  variables: QueryModelTableRecordsVariables
) => RawQuery;

/**
 * RECORD
 */

export interface QueryRecordAttributesVariables extends QueryVariables {
  id: string | number;
}
export type QueryRecordAttributes = (
  modelName: string,
  attributes: ParsedAttribute[]
) => RawQuery;

export type MutateRecordAttributes = (
  modelName: string,
  attributes: ParsedAttribute[]
) => RawQuery;
