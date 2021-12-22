import { ParsedUrlQuery } from 'querystring';

export type AppRoutes = Array<RouteGroup | RouteLink>;

export interface ModelRoutes {
  models: RouteLink[];
}

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
}

export interface RecordUrlQuery extends ModelUrlQuery {
  request: string;
  id?: string;
}

export interface AssociationUrlQuery extends RecordUrlQuery {
  association: string;
}
