import { ParsedAttribute, AttributeScalarType } from '@/types/models';

export interface QueryVariables {
  [key: string]: unknown;
}

export interface ComposedQuery<V = QueryVariables> {
  resolver: string;
  query: string;
  variables?: V;
}

export interface QueryModelTableRecordsVariables extends QueryVariables {
  search: {
    field: string;
    value: string;
    valueType: AttributeScalarType;
  };
  pagination: {
    first: number;
    last: number;
    after: string;
    before: string;
    includeCursor: boolean;
  };
  order: {
    field: string;
    order: 'ASC' | 'DESC';
  };
}
export type QueryModelTableRecords = (
  modelName: string,
  attributes: ParsedAttribute[],
  variables: QueryModelTableRecordsVariables
) => ComposedQuery<QueryModelTableRecordsVariables>;

export interface QueryRecordAttributesVariables extends QueryVariables {
  id: string | number;
}
export type QueryRecordAttributes = (
  modelName: string,
  attributes: ParsedAttribute[],
  variables: QueryRecordAttributesVariables
) => ComposedQuery<QueryRecordAttributesVariables>;
