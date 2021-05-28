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
  resource: string,
  permissions?: AuthPermissions
): ParsedPermissions {
  const defaultPermissions: ParsedPermissions = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  // Without user permissions (e.g. not logged in), access to the resource is forbidden
  if (!permissions) return defaultPermissions;

  const aclPermissions = permissions[resource];

  // When the resource is not controlled, full access is granted to the user
  if (!aclPermissions)
    return {
      create: true,
      read: true,
      update: true,
      delete: true,
    };

  // When the resource is controlled, permissions are parsed
  const parsedPermissions = aclPermissions.reduce(
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

  return parsedPermissions;
}
