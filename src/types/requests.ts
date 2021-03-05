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
  startCursor: undefined | string;
  endCursor: undefined | string;
  hasPreviousPage: undefined | boolean;
  hasNextPage: undefined | boolean;
}
