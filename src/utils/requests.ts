import axios, { AxiosResponse } from 'axios';
import { GRAPHQL_URL } from '@/config/globals';
import { ComposedQuery, QueryVariables } from '@/types/queries';
import { ReadManyResponse, RequestOneResponse } from '@/types/requests';

interface ServerResponse<T = unknown> {
  data?: T | null;
  errors?: Error[];
  status: number;
  statusText: string;
}

/**
 * Generic query interface to the backend graphql-server using axios
 * @param query string to send to the graphql endpoint
 * @param variables variables used in the query string
 * @param token authentication token
 */
export async function graphql<R = unknown>(
  token: string,
  query: string,
  variables?: QueryVariables | null,
  additionalData?: { [key: string]: unknown }
): Promise<ServerResponse<R>> {
  let response: AxiosResponse;
  try {
    response = await axios({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: token ? `Bearer ${token}` : null,
      },
      data: {
        query,
        variables,
        ...additionalData,
      },
    });
  } catch (error) {
    return {
      errors: [error],
      status: error.response.status,
      statusText: error.response.statusText,
    };
  }

  return {
    data: response.data.data,
    errors: response.data.errors,
    status: response.status,
    statusText: response.statusText,
  };
}

export async function readMany(
  token: string,
  request: ComposedQuery
): Promise<unknown[]> {
  const response = await graphql<ReadManyResponse>(
    token,
    request.query,
    request.variables
  );

  if (response.errors) throw response.errors;

  return response.data
    ? response.data[request.resolver].edges.map((edge) => edge.node)
    : [];
}

export async function requestOne<T = unknown>(
  token: string,
  request: ComposedQuery,
  additionalData?: { [key: string]: unknown }
): Promise<T | null> {
  const { query, resolver, variables } = request;
  const response = await graphql<RequestOneResponse<T>>(
    token,
    query,
    variables,
    additionalData
  );

  if (response.errors) throw response.errors;

  return response.data ? response.data[resolver] : null;
}
