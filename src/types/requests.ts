export interface ReadManyResponse {
  [key: string]: {
    edges: Array<{ node: unknown }>;
  };
}

export interface ReadOneResponse<T> {
  [key: string]: T;
}
