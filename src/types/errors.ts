import { ErrorObject } from 'ajv';
import { GraphQLFormattedError } from 'graphql';
import { ClientError } from 'graphql-request';
import { GraphQLResponse } from 'graphql-request/dist/types';

type GraphQLRequest = ClientError['request'];
// type GraphQLResponse = ClientError['response'];

export type GraphQLError = GraphQLFormattedError<{
  validationErrors?: ErrorObject[];
}>;

export interface ParsedGraphQLErrors {
  nonValidationErrors: GraphQLError[];
  validationErrors: Record<string, string[]>;
  tokenExpiredErrors: GraphQLError[];
}

export interface ExtendedClientError<T = unknown> {
  response: {
    error?: string;
    errors?: GraphQLError[];
  } & Exclude<GraphQLResponse<T>, 'errors'>;
  request: GraphQLRequest;
}
