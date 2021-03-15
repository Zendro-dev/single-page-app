import axios, { AxiosResponse } from 'axios';
import { GRAPHQL_URL } from '@/config/globals';
import { ComposedQuery, QueryVariables } from '@/types/queries';
import { RequestOneResponse } from '@/types/requests';

interface ServerResponse<T = unknown> {
  data?: T | null;
  errors?: Error[];
  status: number;
  statusText: string;
}

interface GraphqlResponse<T = unknown> {
  data?: T | null;
  errors?: unknown[];
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

  try {
    response = await axios({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: token ? `Bearer ${token}` : null,
      },
      data: formData,
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

export async function graphqlRequest(
  token: string,
  query: string,
  variables?: QueryVariables | null,
  additionalData?: { [key: string]: unknown }
): Promise<GraphqlResponse> {
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
