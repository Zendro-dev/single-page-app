import { useCallback } from 'react';
import dataModels from '@/generated/models';
import { Model } from '@/types/models';
import { getResourcePermissions } from '@/utils/acl';

import { useAuth } from '@/auth/AuthProvider';

type GetModel = (modelName: string) => Model;

export function useModel(): GetModel;
export function useModel(modelName: string): Model;
export function useModel(modelName?: string): Model | GetModel {
  const { authenticated, permissions } = useAuth();
  const getModel = useCallback(
    (modelName: string): Model => {
      // getResourcePermissions treats `undefined` as "no session" (deny
      // all) - AuthProvider's `permissions` defaults to {} rather than
      // undefined while logged out (see its own comment), so that
      // translation happens here instead.
      const modelPermissions = getResourcePermissions(
        modelName,
        authenticated ? permissions : undefined
      );

      return {
        ...dataModels[modelName],
        permissions: modelPermissions,
      };
    },
    [authenticated, permissions]
  );

  return modelName ? getModel(modelName) : getModel;
}

export default useModel;
