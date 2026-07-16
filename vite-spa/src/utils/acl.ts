import { ParsedPermissions } from '@/types/acl';
import { AuthPermissions } from '@/types/auth';

// aclSetResourceReducer (the other export this file used to have) is gone -
// it only existed for utils/auth.ts's client-side getUserPermissions(),
// which decoded ACL rules from a raw JWT and ran them through the acl2
// package locally. That whole flow no longer applies now that permissions
// come from gqs's own /auth/permissions endpoint instead (see
// src/auth/AuthProvider.tsx) - utils/auth.ts wasn't ported for the same
// reason, and acl2 is no longer a dependency of this app at all.

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
