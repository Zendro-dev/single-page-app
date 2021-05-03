import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dataModels from '@/build/models.preval';
import { authSelector } from '@/store/auth-slice';
import { ParsedDataModel2 } from '@/types/models';
import { ParsedPermissions } from '@/types/acl';

interface Model {
  permissions: ParsedPermissions;
  schema: ParsedDataModel2;
}

type GetModel = (modelName: string) => Model;

export function useModel(): GetModel;
export function useModel(modelName: string): Model;
export function useModel(modelName?: string): Model | GetModel {
  const { user } = useSelector(authSelector);

  const getPermissions = useCallback(
    (modelName: string): ParsedPermissions => {
      const defaultPermissions: ParsedPermissions = {
        create: false,
        read: false,
        update: false,
        delete: false,
      };

      const aclPermissions = user?.permissions[modelName];

      const permissions = aclPermissions
        ? aclPermissions.reduce(
            (acc, x) =>
              x === '*'
                ? Object.assign(acc, {
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                  })
                : Object.assign(acc, { [x]: true }),
            defaultPermissions
          )
        : defaultPermissions;

      return permissions;
    },
    [user?.permissions]
  );

  const getModel = useCallback(
    (modelName: string): Model => {
      const permissions = getPermissions(modelName);

      return {
        permissions,
        schema: dataModels[modelName],
      };
    },
    [getPermissions]
  );

  return modelName ? getModel(modelName) : getModel;
}

export default useModel;
