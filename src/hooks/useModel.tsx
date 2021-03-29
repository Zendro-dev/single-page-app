import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/auth-slice';
import { CrudRequest } from '@/types/requests';
import { ModelUrlQuery } from '@/types/routes';
import { getPathRequest } from '@/utils/router';

interface UseModel {
  allowed: boolean;
  id?: string;
  name?: string;
  request?: CrudRequest;
}

export default function useModel(): UseModel {
  const router = useRouter();
  const { user } = useSelector(authSelector);

  /**
   * Parse the route path to get the requested model resource information
   */
  const model = useMemo(() => {
    const { model, id } = router.query as ModelUrlQuery;
    let allowed = false;
    let request: CrudRequest | undefined;

    if (!model) {
      allowed = true;
    } else {
      request = getPathRequest(router.asPath, model);
      if (request) {
        allowed =
          user?.permissions[model]?.some((x) => x === request || x === '*') ??
          false;
      }
    }

    return {
      allowed,
      id,
      name: model,
      request,
    };
  }, [router.asPath, router.query, user]);

  return model;
}
