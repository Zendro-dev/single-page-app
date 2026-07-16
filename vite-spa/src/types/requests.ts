import { DataRecord } from './models';

export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: DataRecord }>;
    pageInfo: PageInfo;
  };
}

export interface RequestOneResponse<T> {
  [key: string]: T;
}

export interface EdgePageInfo {
  data: DataRecord[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  startCursor: null | string;
  endCursor: null | string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type CrudRequest = 'create' | 'read' | 'update' | 'delete';
