import { QueryVariables } from './queries';

export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: unknown }>;
  };
}

export type ReadOneFn = <T, V extends QueryVariables>(
  variables?: V
) => (
  token: string,
  resolver: string,
  query: string
) => Promise<ReadOneResponse<T> | null>;

export interface ReadOneResponse<T> {
  [key: string]: T;
}
