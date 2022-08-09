import { ErrorObject } from 'ajv';
import { GraphQLFormattedError } from 'graphql';
import { ClientError } from 'graphql-request';
import { GraphQLResponse } from 'graphql-request/dist/types';

type GraphQLRequest = ClientError['request'];
// type GraphQLResponse = ClientError['response'];

export interface GenericError extends Error {
  status: number;
}

// Workaround? to add add well-defined Graphql error extensions object. Generics were removed in https://github.com/graphql/graphql-js/pull/3131
export type GraphQLError = Omit<GraphQLFormattedError, 'extensions'> & {
  extensions?: { validationErrors?: ErrorObject[] };
};

export interface ParsedGraphQLErrors {
  nonValidationErrors: GraphQLError[];
  validationErrors: Record<string, string[]>;
  tokenInvalidErrors: GraphQLError[];
}

export interface ParsedErrorResponse {
  status: number;
  networkError?: string;
  genericError?: string;
  graphqlErrors?: ParsedGraphQLErrors;
}

export interface ExtendedClientError<T = unknown> {
  response: {
    error?: string;
    errors?: GraphQLError[];
  } & Exclude<GraphQLResponse<T>, 'errors'>;
  request: GraphQLRequest;
}
