import Acl from 'acl2';

import aclModels from '@/build/acl-models.preval';
import { AuthToken, AuthPermissions } from '@/types/auth';
import { aclSetResourceReducer } from '@/utils/acl';

/**
 * Check whether the token expiration date is still valid.
 * @param token decoded auth token
 * @returns whether the token is valid
 */
export function isTokenValid(token: AuthToken): boolean {
  const currDate = new Date();
  const expDate = new Date(token.exp * 1000);
  if (currDate > expDate) return false;
  return true;
}

export async function getUserPermissions(
  user: string,
  roles: string[]
): Promise<AuthPermissions> {
  // acl2's own bundled types (types/index.d.ts) declare memoryBackend as a
  // plain `() => void` rather than constructable, even though it's a real
  // constructor at runtime (verified directly) - an upstream typing bug.
  const acl = new Acl(
    new (Acl.memoryBackend as unknown as new () => Acl.Backend)()
  );

  // Server defined ACL rules
  await acl.allow(aclModels);

  // Current user and its associated roles
  await acl.addUserRoles(user, roles);

  // Resources for which permissions should be retrieved
  const modelResources = aclModels.reduce(aclSetResourceReducer, []);

  // acl2 types this as Record<string, string[]> - narrowing each permission
  // string to this app's own AclPermission union, which is trusted to match
  // what's actually configured in aclModels/aclSetResourceReducer above.
  return acl.allowedPermissions(
    user,
    modelResources
  ) as unknown as Promise<AuthPermissions>;
}
