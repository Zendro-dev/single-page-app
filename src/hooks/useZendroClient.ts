import { GRAPHQL_URL } from '@/config/globals';
import { GraphQLClient } from 'graphql-request';
import useAuth from './useAuth';

export default function useZendroClient(): GraphQLClient {
  const { auth } = useAuth();

  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      authorization: 'Bearer ' + auth.user?.token,
    },
  });

  return client;
}
