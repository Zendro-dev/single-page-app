import { ParsedUrlQuery } from 'querystring';

export interface AppRoute<T extends ParsedUrlQuery = ParsedUrlQuery> {
  name: string;
  href: string;
  params: T;
}

export interface AppRoutes2 {
  admin: AppRoute[];
  models: AppRoute[];
}

export interface GroupUrlQuery extends ParsedUrlQuery {
  group: string;
}

export interface ModelUrlQuery extends GroupUrlQuery {
  model: string;
  id?: string;
}

export interface RecordUrlQuery extends GroupUrlQuery {
  request: string;
  id?: string;
}

/* DEPRECATED */

export interface ModelRoute {
  name: string;
  href: string;
}

export interface AppRoutes {
  admin: ModelRoute[];
  models: ModelRoute[];
}
