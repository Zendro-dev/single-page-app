import { useSelector } from 'react-redux';
import dataModels from '@/build/models.preval';
import { authSelector } from '@/store/auth-slice';
import { ParsedDataModel2 } from '@/types/models';
import { AclPermission, ParsedPermissions } from '@/types/acl';
import { useCallback, useMemo } from 'react';

interface UseModel {
  permissions: ParsedPermissions;
  schema: ParsedDataModel2;
}

export default function useModel(modelName: string): UseModel {
  const { user } = useSelector(authSelector);

  const parsePermissions = useCallback(
    (
      aclPermissions: AclPermission[],
      defaultPermissions: ParsedPermissions
    ): ParsedPermissions => {
      return aclPermissions.reduce(
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
      );
    },
    []
  );

  const permissions = useMemo(() => {
    const defaultPermissions: ParsedPermissions = {
      create: false,
      read: false,
      update: false,
      delete: false,
    };

    const aclPermissions = user?.permissions[modelName];

    return aclPermissions
      ? parsePermissions(aclPermissions, defaultPermissions)
      : defaultPermissions;
  }, [modelName, parsePermissions, user]);

  return {
    permissions,
    schema: dataModels[modelName],
  };
}
