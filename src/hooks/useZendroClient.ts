import axios, { AxiosError } from 'axios';
import { GraphQLClient } from 'graphql-request';
import {
  ClientError,
  GraphQLResponse,
  RequestDocument,
  Variables,
} from 'graphql-request/dist/types';
import queries from '@/build/queries.preval';
import { GRAPHQL_URL, METAQUERY_URL } from '@/config/globals';
import { StaticQueries } from '@/types/static';
import { ExtendedClientError } from '@/types/errors';
import useAuth from './useAuth';

type Only<T, U> = { [P in keyof T]: T[P] } & { [P in keyof U]?: never };
type Either<T, U> = Only<T, U> | Only<U, T>;

interface MetaRequestOptions {
  variables?: Record<string, string>;
}

interface OptsWithJQ extends MetaRequestOptions {
  jq: string;
}

interface OptsWithJsonPath extends MetaRequestOptions {
  jsonPath: string;
}

type MetaQueryRequest = <T = unknown>(
  query: string,
  options: Either<OptsWithJQ, OptsWithJsonPath>
) => Promise<T>;

type GraphQLRequest = <T = any>(
  document: RequestDocument,
  variables?: Variables
) => Promise<T>;

interface UseZendroClient {
  metaRequest: MetaQueryRequest;
  request: GraphQLRequest;
  queries: Record<string, StaticQueries>;
}

export default function useZendroClient(): UseZendroClient {
  const { auth } = useAuth();

  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      authorization: 'Bearer ' + auth.user?.token,
    },
  });

  const request: GraphQLRequest = (document, variables) => {
    return client.request(document, variables);
  };

  const metaRequest: MetaQueryRequest = async (query, options) => {
    const { variables, jq, jsonPath } = options;

    let response: GraphQLResponse;
    try {
      response = await axios({
        url: METAQUERY_URL,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${auth.user?.token}`,
        },
        data: {
          queries: [query],
          jq,
          jsonPath,
          variables,
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<GraphQLResponse>;
      throw new ClientError(
        axiosError.response?.data ?? {
          data: null,
          errors: undefined,
          extensions: undefined,
          status: 500,
          error: axiosError,
        },
        {
          query,
          variables,
        }
      ) as ExtendedClientError;
    }

    if (response.errors)
      throw new ClientError(response, {
        query,
        variables,
      }) as ExtendedClientError;

    return response.data;
  };

  return { metaRequest, queries, request };
}
