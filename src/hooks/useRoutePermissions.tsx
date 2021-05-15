import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ParsedPermissions } from '@/types/acl';
import { getResourcePermissions } from '@/utils/acl';
import { getRoutePath } from '@/utils/router';
import useAuth from './useAuth';

export default function useRoutePermissions(): ParsedPermissions {
  const auth = useAuth();
  const router = useRouter();

  const permissions = useMemo(() => {
    const routePath = getRoutePath(router.asPath);

    const permissions = getResourcePermissions(
      auth.user?.permissions ?? {},
      routePath
    );

    return permissions;
  }, [router.asPath, auth.user?.permissions]);

  return permissions;
}
