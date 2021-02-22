import axios from 'axios';
import decode from 'jwt-decode';
import { LOGIN_URL } from '../config/globals';
import {
  AuthError,
  AuthResponse,
  AuthToken,
  User,
  AUTH_TOKEN_NOT_FOUND,
} from '../types/auth';
import { localStorage } from '../utils/storage';

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

  let user;
  let error;
  try {
    const token = response.data.token as string | undefined;
    if (!token) {
      throw new AuthError(
        AUTH_TOKEN_NOT_FOUND,
        'Token not returned from the server'
      );
    }
    user = createUser(token);
    localStorage.setItem('token', token);
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
    if (!token) {
      throw new AuthError(AUTH_TOKEN_NOT_FOUND, 'Token not found');
    }
    user = createUser(token);
  } catch (err) {
    if (err.code !== AUTH_TOKEN_NOT_FOUND) {
      localStorage.removeItem('token');
      error = err;
    }
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
export function createUser(token: string): User {
  const decodedToken = decode(token) as AuthToken;
  const { email, exp, id, roles } = decodedToken;
  const expDate = new Date(exp * 1000);

  return {
    email,
    exp,
    id,
    roles,
    token,
    get isValid() {
      const isValid = new Date() < expDate;
      if (!isValid) localStorage.removeItem('token');
      return isValid;
    },
  };
}
