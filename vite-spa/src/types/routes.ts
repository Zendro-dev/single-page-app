// GroupUrlQuery/ModelUrlQuery/RecordUrlQuery/AssociationUrlQuery (ParsedUrlQuery-
// based) are gone - they only existed for Next's getStaticPaths SSG
// enumeration (see build/routes.ts, trimmed down for the same reason).
// Route params now come from react-router's useParams()/useSearchParams()
// directly - see src/hooks/useRouteQuery.ts's own RouteQuery type.
export type AppRoutes = Array<RouteGroup | RouteLink>;

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
