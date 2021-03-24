import axios from 'axios';
import { request } from 'graphql-request';
import { Variables } from 'graphql-request/dist/types';
import { GRAPHQL_URL } from '@/config/globals';
import { QueryVariables } from '@/types/queries';
import { GraphQLErrors, RequestOneResponse } from '@/types/requests';

export interface GraphqlResponse<T = unknown> {
  data?: T | null;
  errors?: unknown[];
}

/**
 * Generic query interface to the backend graphql-server using axios
 * @param token authentication token
 * @param query string to send to the graphql endpoint
 * @param variables variables used in the query string
 * @param additionalData additional file data
 */
export async function graphqlRequest<T = unknown>(
  token: string,
  query: string,
  variables?: QueryVariables | null,
  additionalData?: { [key: string]: unknown }
): Promise<GraphqlResponse<T>> {
  const formData = new FormData();

  formData.append('query', query);

  if (variables) {
    formData.append('variables', JSON.stringify(variables));
  }

  if (additionalData) {
    for (const [key, value] of Object.entries(additionalData)) {
      formData.append(key, value as Blob); //check we might want to add the value as string in some cases
    }
  }

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: token ? `Bearer ${token}` : null,
    },
    data: formData,
  });

  // ? check for response.data ?
  return { data: response.data.data, errors: response.data.errors };
}

interface GraphqlRequestOptions {
  resolver?: string;
  variables?: Variables;
}

export async function graphqlRequest2<T = unknown>(
  token: string,
  query: string,
  options?: {
    variables?: Variables;
  }
): Promise<Record<string, T>>;

export async function graphqlRequest2<T = unknown>(
  token: string,
  query: string,
  options: {
    resolver: string;
    variables?: Variables;
  }
): Promise<T>;

export async function graphqlRequest2<T = unknown>(
  token: string,
  query: string,
  options?: GraphqlRequestOptions
): Promise<T | Record<string, T>> {
  let res: T | Record<string, T>;

  res = await request<Record<string, T>>(
    GRAPHQL_URL as string,
    query,
    options?.variables
  );

  if (options?.resolver) res = res[options?.resolver];
  return res;
}

export async function requestOne<T>(
  token: string,
  query: string,
  resolver: string,
  variables: QueryVariables,
  additionalData?: { [key: string]: unknown }
): Promise<GraphqlResponse<T>> {
  const { data, errors } = await graphqlRequest<RequestOneResponse<T>>(
    token,
    query,
    variables,
    additionalData
  ).catch((err) => {
    throw err;
  });

  return { data: data ? data[resolver] : data, errors };
}

/**
 * Parse and extract validation errors from a graphql errors response.
 * @param errors graphql errors with optional ajv errors extension
 * @returns map of attribute name to ajv error messages
 */
export function parseValidationErrors(
  errors: GraphQLErrors[]
): Record<string, string[]> {
  return errors.reduce((acc, { extensions }) => {
    extensions?.validationErrors?.forEach(({ dataPath, keyword, message }) => {
      const attributeName = dataPath.slice(1);
      const errors = new Set(acc[attributeName]);

      errors.add(message ?? keyword);
      acc[attributeName] = Array.from(errors);
    });
    return acc;
  }, {} as Record<string, string[]>);
}
