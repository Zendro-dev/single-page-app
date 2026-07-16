import axios, { AxiosError, AxiosResponse } from 'axios';
import { GraphQLClient } from 'graphql-request';
import {
  ClientError,
  GraphQLResponse,
  Variables,
} from 'graphql-request/dist/types';
import { useCallback, useMemo } from 'react';

import { GRAPHQL_URL, METAQUERY_URL } from '@/config/globals';
import queries from '@/generated/queries';
import { StaticQueries } from '@/types/static';
import { ExtendedClientError } from '@/types/errors';
import { OneOf } from '@/types/utility';

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

// No Authorization header is ever set here, on purpose: the old next-auth
// session held a raw access token in browser JS and attached it to every
// request by hand. Under the new gqs-owned auth model, the token never
// reaches the browser at all - GRAPHQL_URL/METAQUERY_URL are same-origin
// paths proxied to graphql-server (see hooks.server.ts/server.js), and the
// httpOnly session cookie authenticates the request server-side via
// attachAuthFromSession. `credentials` is set explicitly rather than relying
// on per-client defaults: native fetch (graphql-request) already defaults to
// sending same-origin cookies, but axios does not.
export default function useZendroClient(): UseZendroClient {
  const client = useMemo(
    () => new GraphQLClient(GRAPHQL_URL, { credentials: 'same-origin' }),
    []
  );

  const metaClient = useMemo(
    () => new GraphQLClient(METAQUERY_URL, { credentials: 'same-origin' }),
    []
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

  const legacyRequest: LegacyRequest = useCallback(async (query, requestData) => {
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
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
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
  }, []);

  return useMemo(
    () => ({ legacyRequest, queries, request }),
    [legacyRequest, request]
  );
}

export type { StaticQueries };
