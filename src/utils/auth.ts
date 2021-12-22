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
  const acl = new Acl(new Acl.memoryBackend());

  // Server defined ACL rules
  await acl.allow(aclModels);

  // Current user and its associated roles
  await acl.addUserRoles(user, roles);

  // Resources for which permissions should be retrieved
  const modelResources = aclModels.reduce(aclSetResourceReducer, []);

  // Parse and return the current user permissions
  return new Promise<AuthPermissions>((resolve, reject) => {
    acl.allowedPermissions(user, modelResources, (err, permissions) => {
      if (err) reject(err.message);
      resolve(permissions);
    });
  });
}
