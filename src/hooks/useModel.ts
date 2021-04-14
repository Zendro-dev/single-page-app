import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import dataModels from '@/build/models.preval';
import { authSelector } from '@/store/auth-slice';
import { ParsedDataModel2 } from '@/types/models';
import { ParsedPermissions } from '@/types/acl';

interface UseModel {
  permissions: ParsedPermissions;
  schema: ParsedDataModel2;
}

export default function useModel(modelName: string): UseModel {
  const { user } = useSelector(authSelector);

  const model = useMemo(() => {
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

    const schema = dataModels[modelName];

    return {
      permissions,
      schema,
    };
  }, [modelName, user]);

  return model;
}
