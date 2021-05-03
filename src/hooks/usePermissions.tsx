import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/auth-slice';
import { ParsedPermissions } from '@/types/acl';
import { CrudRequest } from '@/types/requests';
import { ModelUrlQuery } from '@/types/routes';
import { getPathRequest } from '@/utils/router';

interface UseModel {
  allowed: boolean;
  group?: string;
  id?: string;
  name?: string;
  permissions: ParsedPermissions;
  request?: CrudRequest;
}

export default function usePermissions(): UseModel {
  const router = useRouter();
  const { user } = useSelector(authSelector);

  /**
   * Parse the route path to get the requested model resource information
   */
  const model = useMemo(() => {
    const { group, model, id } = router.query as ModelUrlQuery;
    let allowed = false;
    let request: CrudRequest | undefined;

    let permissions: ParsedPermissions = {
      create: false,
      read: false,
      update: false,
      delete: false,
    };

    if (user?.permissions) {
      permissions = user?.permissions[model]?.reduce(
        (acc, x) =>
          x === '*'
            ? Object.assign(acc, {
                create: true,
                read: true,
                update: true,
                delete: true,
              })
            : Object.assign(acc, { [x]: true }),
        permissions
      );
    }

    if (!model) {
      allowed = true;
    } else {
      request = getPathRequest(router.asPath, model);
      if (request) {
        allowed = permissions[request];
      }
    }

    return {
      allowed,
      group,
      id,
      name: model,
      permissions,
      request,
    };
  }, [router.asPath, router.query, user]);

  return model;
}
