import { AclPermission } from './acl';

export const AUTH_TOKEN_NOT_FOUND = 'AUTH_TOKEN_NOT_FOUND';
export const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED';
export const AUTH_PERMISSIONS_NOT_FOUND = 'AUTH_PERMISSIONS_NOT_FOUND';
export const AUTH_REQUEST_CANCELLED = 'AUTH_REQUEST_CANCELLED';

export interface AuthToken {
  email: string;
  exp: number;
  id: string | number;
  roles: string[];
}

export interface AuthPermissions {
  [key: string]: AclPermission[];
}

export interface User extends AuthToken {
  token: string;
  permissions: AuthPermissions;
}

export interface UserRequest {
  email: string;
  password: string;
}
