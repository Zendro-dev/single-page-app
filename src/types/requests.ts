export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: unknown }>;
    pageInfo: PageInfo;
  };
}

export interface RequestOneResponse<T> {
  [key: string]: T;
}

export interface EdgePageInfo {
  data: unknown[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  startCursor: null | string;
  endCursor: null | string;
  hasPreviousPage: null | boolean;
  hasNextPage: null | boolean;
}

export type CrudRequest = 'create' | 'read' | 'update' | 'delete';
