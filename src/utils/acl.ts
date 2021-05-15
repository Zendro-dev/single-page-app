import { ParsedPermissions } from '@/types/acl';
import { AuthPermissions } from '@/types/auth';
import Acl from 'acl2';

/**
 * Reduce an array of AclSet objects into an array of unique resources.
 * @param resources array of unique resources
 * @param aclSet set of ACL rules
 * @returns an array of unique ACL set resources
 */
export function aclSetResourceReducer(
  resources: string[],
  aclSet: Acl.AclSet
): string[] {
  const rawResources = aclSet.allows.reduce<string[]>(
    (setResources, allowed) => [...setResources, ...allowed.resources],
    []
  );

  const uniqueResources = new Set([...resources, ...rawResources]);
  return Array.from(uniqueResources);
}

/**
 * Get the ACL permissions for a given resource as a CRUD->boolean mapped type.
 * @param permissions mapped object of CRUD permission strings
 * @param resource resource key
 * @returns a CRUD->boolean map object.
 */
export function getResourcePermissions(
  permissions: AuthPermissions,
  resource: string
): ParsedPermissions {
  const defaultPermissions: ParsedPermissions = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  const aclPermissions = permissions[resource];

  const parsedPermissions = aclPermissions
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
    : {
        create: true,
        read: true,
        update: true,
        delete: true,
      };

  return parsedPermissions;
}
