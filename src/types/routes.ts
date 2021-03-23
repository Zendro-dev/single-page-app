import { ParsedUrlQuery } from 'querystring';

export interface ModelRoute {
  name: string;
  href: string;
}

export interface AppRoutes {
  admin: ModelRoute[];
  models: ModelRoute[];
}

export interface ModelUrlQuery extends ParsedUrlQuery {
  model: string;
  id?: string;
}
