import { ClientError } from 'graphql-request';
import { GraphQLResponse } from 'graphql-request/dist/types';
import { DataRecord } from './models';
import { ErrorObject } from 'ajv';
import { GraphQLFormattedError } from 'graphql';

export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: DataRecord }>;
    pageInfo: PageInfo;
  };
}

export interface RequestOneResponse<T> {
  [key: string]: T;
}

export interface EdgePageInfo {
  data: DataRecord[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  startCursor: null | string;
  endCursor: null | string;
  hasPreviousPage: null | boolean;
  hasNextPage: null | boolean;
}

export type CrudRequest = 'create' | 'read' | 'update' | 'delete';

type GraphQLRequest = ClientError['request'];
// type GraphQLResponse = ClientError['response'];

export type GraphQLErrors = GraphQLFormattedError<{
  validationErrors?: ErrorObject[];
}>;

export interface ExtendedClientError<T = unknown> {
  response: {
    error?: string;
    errors?: GraphQLErrors[];
  } & Exclude<GraphQLResponse<T>, 'errors'>;
  request: GraphQLRequest;
}
