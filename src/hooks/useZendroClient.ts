import axios, { AxiosError, AxiosResponse } from 'axios';
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
import { OneOf } from '@/types/utility';
import useAuth from './useAuth';
import { useCallback, useMemo } from 'react';

type MetaRequestOptions = {
  variables?: Variables;
} & OneOf<{
  jq: string;
  jsonPath: string;
}>;

type LegacyRequest = <T = unknown>(
  query: string,
  requestData: Record<string, string | Blob>
) => Promise<T>;

type MetaQueryRequest = <T = unknown>(
  query: string,
  options: MetaRequestOptions
) => Promise<T>;

type GraphQLRequest = <T = any>(
  document: RequestDocument,
  variables?: Variables
) => Promise<T>;

interface UseZendroClient {
  legacyRequest: LegacyRequest;
  metaRequest: MetaQueryRequest;
  request: GraphQLRequest;
  queries: Record<string, StaticQueries>;
}

export default function useZendroClient(): UseZendroClient {
  const { auth } = useAuth();

  const client = useMemo(
    () =>
      new GraphQLClient(GRAPHQL_URL, {
        headers: {
          authorization: 'Bearer ' + auth.user?.token,
        },
      }),
    [auth.user?.token]
  );

  const request: GraphQLRequest = useCallback(
    (document, variables) => {
      return client.request(document, variables);
    },
    [client]
  );

  const metaRequest: MetaQueryRequest = useCallback(
    async (query, options) => {
      const { variables, jq, jsonPath } = options;

      let response: AxiosResponse<GraphQLResponse>;
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
            queries: [
              {
                query,
                variables,
              },
            ],
            jq,
            jsonPath,
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

      if (response.data.errors) {
        throw new ClientError(response.data, {
          query,
          variables,
        }) as ExtendedClientError;
      }

      return response.data.data;
    },
    [auth.user?.token]
  );

  const legacyRequest: LegacyRequest = useCallback(
    async (query, requestData) => {
      const formData = new FormData();

      formData.append('query', query);
      Object.entries(requestData).forEach(([key, value]) =>
        formData.append(key, value)
      );

      let response: AxiosResponse<GraphQLResponse>;
      try {
        response = await axios({
          url: GRAPHQL_URL,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `Bearer ${auth.user?.token}`,
          },
          data: formData,
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
            variables: requestData.variables as Variables | undefined,
            ...formData,
          }
        ) as ExtendedClientError;
      }

      if (response.data.errors) {
        throw new ClientError(response.data, {
          query,
          variables: requestData.variables as Variables | undefined,
        }) as ExtendedClientError;
      }

      return response.data.data;
    },
    [auth.user?.token]
  );

  return useMemo(() => ({ legacyRequest, metaRequest, queries, request }), [
    legacyRequest,
    metaRequest,
    request,
  ]);
}
