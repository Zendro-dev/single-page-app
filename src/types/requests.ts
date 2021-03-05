export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: unknown }>;
  };
}

export interface RequestOneResponse<T> {
  [key: string]: T;
}
