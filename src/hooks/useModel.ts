import { useCallback } from 'react';
import dataModels from '@/build/models.preval';
import { Model } from '@/types/models';
import { getResourcePermissions } from '@/utils/acl';

import { useSession } from 'next-auth/react';

type GetModel = (modelName: string) => Model;

export function useModel(): GetModel;
export function useModel(modelName: string): Model;
export function useModel(modelName?: string): Model | GetModel {
  const { data: session } = useSession();
  const getModel = useCallback(
    (modelName: string): Model => {
      const permissions = getResourcePermissions(
        modelName,
        session?.permissions
      );

      return {
        ...dataModels[modelName],
        permissions,
      };
    },
    [session?.permissions]
  );

  return modelName ? getModel(modelName) : getModel;
}

export default useModel;
