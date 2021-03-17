import axios from 'axios';
import { GRAPHQL_URL } from '@/config/globals';
import { QueryVariables } from '@/types/queries';
import { RequestOneResponse } from '@/types/requests';

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
