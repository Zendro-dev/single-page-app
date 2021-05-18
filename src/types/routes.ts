import { ParsedUrlQuery } from 'querystring';

export type AppRoutes2 = Array<RouteGroup | RouteLink>;

export interface RouteLink {
  type: 'link';
  name: string;
  icon?: string;
  href: string;
}

export interface RouteGroup {
  type: 'group';
  name: string;
  icon?: string;
  routes: RouteLink[];
}

export interface GroupUrlQuery extends ParsedUrlQuery {
  group: string;
}

export interface ModelUrlQuery extends GroupUrlQuery {
  model: string;
  id?: string;
}

export interface RecordUrlQuery extends ModelUrlQuery {
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
