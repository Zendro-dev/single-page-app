import Acl, { AclSet } from 'acl';
import axios from 'axios';
import decode from 'jwt-decode';

import { localStorage } from './storage';
import aclRules from '@/build/acl-rules';
import routes from '@/build/routes';
import { LOGIN_URL } from '@/config/globals';
import {
  AuthError,
  AuthResponse,
  AuthToken,
  User,
  AUTH_TOKEN_NOT_FOUND,
  AuthPermissions,
  AUTH_PERMISSIONS_NOT_FOUND,
} from '@/types/auth';
import { ModelRoute } from '@/types/routes';

/**
 * Authenticate as user using the GraphQL server API.
 * @param email user email
 * @param password user password
 */
export async function authenticateFromRemote(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await axios({
    url: LOGIN_URL,
    data: { email, password },
    method: 'POST',
  });

  let user: User | undefined;
  let error: AuthError | undefined;

  try {
    const token = response.data.token as string | undefined;

    if (!token) {
      throw new AuthError(
        AUTH_TOKEN_NOT_FOUND,
        'Token not returned from the server'
      );
    }

    const decodedToken = decode(token) as AuthToken;
    const permissions = await getUserPermissions(
      decodedToken.email,
      decodedToken.roles
    );

    user = createUser(token, decodedToken, permissions);

    localStorage.setItem('token', token);
    localStorage.setItem('permissions', JSON.stringify(permissions));
  } catch (tokenError) {
    error = tokenError;
  }

  return {
    user,
    error,
  };
}

/**
 * Attempt to decode a local auth JWT.
 */
export function authenticateFromToken(): AuthResponse {
  let user: User | undefined = undefined;
  let error: AuthError | undefined = undefined;

  const token = localStorage.getItem('token');
  try {
    if (!token) throw new AuthError(AUTH_TOKEN_NOT_FOUND, 'Token not found');
    const decodedToken = decode(token) as AuthToken;

    const permissions = localStorage.getItem('permissions');
    if (!permissions)
      throw new AuthError(AUTH_PERMISSIONS_NOT_FOUND, 'Permissions not found');

    user = createUser(token, decodedToken, JSON.parse(permissions));
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    error = err;
  }

  return {
    user,
    error,
  };
}

/**
 * Creates a User object from a decoded token.
 * @param decodedToken decoded auth JWT from the remote or local storage
 */
export function createUser(
  token: string,
  decodedToken: AuthToken,
  permissions: AuthPermissions
): User {
  const { email, exp, id, roles } = decodedToken;
  const expDate = new Date(exp * 1000);

  return {
    email,
    exp,
    id,
    permissions,
    roles,
    token,
    get isValid() {
      const isValid = new Date() < expDate;
      if (!isValid) localStorage.removeItem('token');
      return isValid;
    },
  };
}

export async function getUserPermissions(
  user: string,
  roles: string[]
): Promise<AuthPermissions> {
  const acl = new Acl(new Acl.memoryBackend());

  // Default or custom acl rules
  await acl.allow((aclRules as unknown) as AclSet);

  // The current user and its associated roles
  await acl.addUserRoles(user, roles);

  // Controlled resources for which permissions should be retrieved
  const resources = ((routes as unknown) as ModelRoute[]).map(
    ({ name }) => name
  ) as string[];

  // Parse the current user permissions
  return new Promise<AuthPermissions>((resolve, reject) => {
    acl.allowedPermissions(user, resources, (err, permissions) => {
      if (err) reject(err.message);
      resolve(permissions);
    });
  });
}
