import { GRAPHQL_SERVER_URL } from '@/config/globals';
import axios from 'axios';
import { AttributeScalarType, AttributeArrayType } from '../types/models';

interface ServerResponse {
  // ! in need of correct typing
  data?: any;
  errors: unknown;
  status?: unknown;
  statusText?: unknown;
}

/**
 * generic query interface to the backend graphql-server using axios
 *
 * @param query
 * @param variables
 * @param token
 */
export async function graphql(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<ServerResponse> {
  let response;
  try {
    response = await axios({
      url: GRAPHQL_SERVER_URL,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: token ? `Bearer ${token}` : null,
      },
      data: {
        query,
        variables,
      },
    });
  } catch (error) {
    return {
      errors: [error],
    };
  }

  return {
    data: response.data.data,
    errors: response.data.errors,
    status: response.status,
    statusText: response.statusText,
  };
}

export const readMany = () => async (
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<Array<Record<string, AttributeScalarType | AttributeArrayType>>> => {
  const response = await graphql(query, variables, token);

  const resData = response.data;
  // ! figure out where to get the resolver name from
  const resolver = Object.keys(resData)[0];

  const data = resData[resolver].edges.map(
    (edge: {
      node: Record<string, AttributeArrayType | AttributeScalarType>;
    }) => edge.node
  );
  return data;
};
