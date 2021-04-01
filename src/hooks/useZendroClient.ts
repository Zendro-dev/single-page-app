import { GraphQLClient } from 'graphql-request';
import { RequestDocument, Variables } from 'graphql-request/dist/types';
import { GRAPHQL_URL } from '@/config/globals';
import queries from '@/build/queries.preval';
import { StaticQueries } from '@/types/static';
import useAuth from './useAuth';

interface UseZendroClient {
  request: <T = any>(
    document: RequestDocument,
    variables?: Variables
  ) => Promise<T>;
  queries: Record<string, StaticQueries>;
}

export default function useZendroClient(): UseZendroClient {
  const { auth } = useAuth();

  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      authorization: 'Bearer ' + auth.user?.token,
    },
  });

  const request = <T>(
    document: RequestDocument,
    variables?: Variables
  ): Promise<T> => {
    return client.request<T>(document, variables);
  };

  return { request, queries };
}
