import { GRAPHQL_SERVER_URL } from '@/config/globals';
import axios, { AxiosResponse } from 'axios';
import { getInflections } from '@/utils/inflection';
import { AttributeScalarType } from '@/types/models';

interface ServerResponse<D, E> {
  data?: D | null;
  errors?: Array<E>;
  status: number;
  statusText: string;
}

interface QueryVariables {
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

interface Query {
  [key: string]: {
    edges: QueryEdge[];
  };
}

interface QueryEdge {
  node: QueryNode;
}

// TODO type this correctly
interface QueryNode {
  [key: string]: any;
}

/**
 * generic query interface to the backend graphql-server using axios
 *
 * @param query
 * @param variables
 * @param token
 */
export async function graphql<D, E = any>(
  query: string,
  variables: QueryVariables,
  token: string
): Promise<ServerResponse<D, E>> {
  let response: AxiosResponse;
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

export const readMany = <Q extends Query>(modelName: string) => async (
  query: string,
  variables: QueryVariables,
  token: string
): Promise<any> => {
  const response = await graphql<Q>(query, variables, token);
  const resData = response.data;
  // ? useSWR hook returns this as {error}
  const resErrors = response.errors;
  if (resErrors) {
    throw resErrors;
  }

  const resolver = `${getInflections(modelName).namePlLc}Connection` as keyof Q;

  let data: QueryNode[] = [];

  if (resData) {
    data = resData[resolver].edges.map((edge) => edge.node);
  }
  return data;
};
