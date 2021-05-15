import { useCallback } from 'react';
import { ParsedPermissions } from '@/types/acl';
import { getResourcePermissions } from '@/utils/acl';
import { getRoutePath } from '@/utils/router';
import useAuth from './useAuth';

type GetRoutePermissions = (route: string) => ParsedPermissions;

export function useRoutePermissions(): GetRoutePermissions;
export function useRoutePermissions(route: string): ParsedPermissions;
export function useRoutePermissions(
  route?: string
): ParsedPermissions | GetRoutePermissions {
  const auth = useAuth();

  const getRoutePermissions = useCallback(
    (route: string) => {
      const permissions = getResourcePermissions(
        auth.user?.permissions ?? {},
        route
      );

      return permissions;
    },
    [auth.user?.permissions]
  );

  return route ? getRoutePermissions(getRoutePath(route)) : getRoutePermissions;
}

export default useRoutePermissions;
