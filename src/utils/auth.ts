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
  // acl2 v4 types `memoryBackend` as returning void, but at runtime it is a
  // backend constructor, so cast it to the shape the Acl constructor expects.
  const MemoryBackend = Acl.memoryBackend as unknown as new () => Acl.Backend;
  const acl = new Acl(new MemoryBackend());

  // Server defined ACL rules
  await acl.allow(aclModels);

  // Current user and its associated roles
  await acl.addUserRoles(user, roles);

  // Resources for which permissions should be retrieved
  const modelResources = aclModels.reduce(aclSetResourceReducer, []);

  // Parse and return the current user permissions (acl2 v4 is promise-based)
  const permissions = await acl.allowedPermissions(user, modelResources);
  return permissions as AuthPermissions;
}
