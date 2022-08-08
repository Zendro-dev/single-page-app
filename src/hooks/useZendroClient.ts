import axios, { AxiosError, AxiosResponse } from 'axios';
import { GraphQLClient } from 'graphql-request';
import {
  ClientError,
  GraphQLResponse,
  Variables,
} from 'graphql-request/dist/types';
import { useCallback, useMemo } from 'react';

import { GRAPHQL_URL, METAQUERY_URL } from '@/config/globals';
import queries from '@/build/queries.preval';
import { StaticQueries } from '@/types/static';
import { ExtendedClientError } from '@/types/errors';
import { OneOf } from '@/types/utility';

import { useSession } from 'next-auth/react';

type LegacyRequest = <T = unknown>(
  query: string,
  requestData: Record<string, string | Blob>
) => Promise<T>;

type GraphQLRequest = <T = unknown>(
  query: string,
  options?: GraphQLRequestOptions
) => Promise<T>;

type GraphQLRequestOptions = {
  variables?: Variables;
} & Partial<
  OneOf<{
    jq: string;
    jsonPath: string;
  }>
>;

interface UseZendroClient {
  legacyRequest: LegacyRequest;
  request: GraphQLRequest;
  queries: Record<string, StaticQueries>;
}

export default function useZendroClient(): UseZendroClient {
  const { data: session } = useSession({ required: false });

  const client = useMemo(
    () =>
      new GraphQLClient(GRAPHQL_URL, {
        headers: {
          authorization: 'Bearer ' + session?.accessToken,
        },
      }),
    [session?.accessToken]
  );

  const metaClient = useMemo(
    () =>
      new GraphQLClient(METAQUERY_URL, {
        headers: {
          authorization: 'Bearer ' + session?.accessToken,
        },
      }),
    [session?.accessToken]
  );

  const request: GraphQLRequest = useCallback(
    (query, options) => {
      const variables = options?.variables;
      const jq = options?.jq;
      const jsonPath = options?.jsonPath;

      if (jq) {
        return metaClient.request(query, variables, { jq });
      } else if (jsonPath) {
        return metaClient.request(query, variables, { jsonPath });
      } else {
        return client.request(query, variables);
      }
    },
    [client, metaClient]
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
            Authorization: `Bearer ${session?.accessToken}`,
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
    [session?.accessToken]
  );

  return useMemo(
    () => ({ legacyRequest, queries, request }),
    [legacyRequest, request]
  );
}
