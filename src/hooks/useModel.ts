import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dataModels from '@/build/models.preval';
import { authSelector } from '@/store/auth-slice';
import { ParsedDataModel2 } from '@/types/models';
import { ParsedPermissions } from '@/types/acl';
import { getResourcePermissions } from '@/utils/acl';

interface Model {
  permissions: ParsedPermissions;
  schema: ParsedDataModel2;
}

type GetModel = (modelName: string) => Model;

export function useModel(): GetModel;
export function useModel(modelName: string): Model;
export function useModel(modelName?: string): Model | GetModel {
  const { user } = useSelector(authSelector);

  const getModel = useCallback(
    (modelName: string): Model => {
      const permissions = getResourcePermissions(
        user?.permissions ?? {},
        modelName
      );

      return {
        permissions,
        schema: dataModels[modelName],
      };
    },
    [user?.permissions]
  );

  return modelName ? getModel(modelName) : getModel;
}

export default useModel;
