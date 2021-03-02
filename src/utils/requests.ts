import axios, { AxiosResponse } from 'axios';
import { GRAPHQL_URL } from '@/config/globals';
import { ComposedQuery, QueryVariables } from '@/types/queries';
import { ReadManyResponse, ReadOneResponse } from '@/types/requests';

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
  variables?: QueryVariables
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


export async function graphqlUploadFile<R = unknown>(
  token: string,
  query: string,
  file: File
): Promise<ServerResponse<R>> {
  let response: AxiosResponse;
  const formData = new FormData();
  formData.append('csv_file', file);
  formData.append('query', query);

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

export async function readOne<T = unknown>(
  token: string,
  request: ComposedQuery
): Promise<T | null> {
  const response = await graphql<ReadOneResponse<T>>(
    token,
    request.query,
    request.variables
  );

  if (response.errors) throw response.errors;

  return response.data ? response.data[request.resolver] : null;
}

//to be moved to types
interface templateResponse{
  [key:string]: string
}

interface bulkCreateResponse{
  [key:string]: string
}

export async function csvTemplate<T = unknown >(
  token: string,
   request: ComposedQuery
): Promise< string | null > {

  const response = await graphql<templateResponse>(
    token,
    request.query
  )

  if(response.errors) throw response.errors;

  return response.data ? response.data[request.resolver] : null;
}

export async function bulkCreate<T = unknown >(
  token: string,
  request: ComposedQuery,
  file: File
): Promise< string | null>{

  const response = await graphqlUploadFile<bulkCreateResponse>(
    token,
    request.query,
    file
  )

  if(response.errors) throw response.errors;

  return response.data ? response.data[request.resolver] : null;


}
