export interface ModelRoute {
  name: string;
  href: string;
}

export interface AppRoutes {
  admin: ModelRoute[];
  models: ModelRoute[];
}
