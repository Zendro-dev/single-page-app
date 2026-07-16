import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';

// Mimics next/router's most-used surface (query/asPath/push) so the ported
// pages stay close to the original: Next merged path params (group/model/
// request/association) and query-string params (id) into one flat `query`
// object; react-router keeps them separate (useParams vs useSearchParams),
// so this just re-merges them the same way.
export interface RouteQuery {
  group?: string;
  model?: string;
  request?: string;
  association?: string;
  id?: string;
}

export interface UseRouteQuery {
  query: RouteQuery;
  asPath: string;
  push: (href: string) => void;
}

export function useRouteQuery(): UseRouteQuery {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const query: RouteQuery = {
    ...params,
    id: searchParams.get('id') ?? undefined,
  };

  return {
    query,
    asPath: location.pathname + location.search,
    push: (href: string) => navigate(href),
  };
}

export default useRouteQuery;
