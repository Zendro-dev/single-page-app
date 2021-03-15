import { SerializedError } from '@reduxjs/toolkit';
import { AclPermission } from './acl';

export const AUTH_TOKEN_NOT_FOUND = 'AUTH_TOKEN_NOT_FOUND';
export const AUTH_PERMISSIONS_NOT_FOUND = 'AUTH_PERMISSIONS_NOT_FOUND';
export const AUTH_REQUEST_CANCELLED = 'AUTH_REQUEST_CANCELLED';
export class AuthError extends Error implements SerializedError {
  public code: string;
  constructor(code: string, message?: string) {
    super(message);
    this.name = 'Authentication Error';
    this.code = code;
  }
}

export interface AuthResponse {
  user?: User;
  error?: AuthError;
}

export interface AuthState extends AuthResponse {
  status: 'idle' | 'loading' | 'success' | 'failed' | 'cancelled';
}

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
  isValid: boolean;
  token: string;
  permissions: AuthPermissions;
}

export interface UserRequest {
  email: string;
  password: string;
}
