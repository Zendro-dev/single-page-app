import { ParsedUrlQuery } from 'querystring';

export interface ModelRoute {
  name: string;
  href: string;
}

export interface AppRoutes {
  admin: ModelRoute[];
  models: ModelRoute[];
}

export interface GroupUrlQuery extends ParsedUrlQuery {
  group: string;
}

export interface ModelUrlQuery extends GroupUrlQuery, ParsedUrlQuery {
  model: string;
  id?: string;
}
