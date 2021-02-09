import axios from 'axios';
import decode from 'jwt-decode';
import { LOGIN_URL } from '../config/globals';
import {
  AuthError,
  AuthResponse,
  AuthToken,
  User,
  AUTH_TOKEN_INVALID,
  AUTH_TOKEN_NOT_FOUND,
} from '../types/auth';

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
    const decodedToken = decode(response.data.token) as AuthToken;
    user = createUser(decodedToken);
    localStorage.setItem('token', response.data.token);
  } catch (decodeError) {
    error = decodeError;
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

  const encodedToken = localStorage.getItem('token');
  try {
    if (!encodedToken) {
      throw new AuthError(AUTH_TOKEN_NOT_FOUND, 'Token not found');
    }

    const decodedToken = decode(encodedToken) as AuthToken;
    if (!decodedToken.hasOwnProperty('exp')) {
      throw new AuthError(AUTH_TOKEN_INVALID, 'Invalid authentication token');
    }

    user = createUser(decodedToken);
  } catch (err) {
    if (err.code !== AUTH_TOKEN_NOT_FOUND) {
      clearAuthToken();
      error = err;
    }
  }

  return {
    user,
    error,
  };
}

/**
 * Clear any auth-related JWTs.
 */
export function clearAuthToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
}

/**
 * Creates a User object from a decoded token.
 * @param decodedToken decoded auth JWT from the remote or local storage
 */
export function createUser(decodedToken: AuthToken): User {
  const { email, exp, id, roles } = decodedToken;
  const expDate = new Date(exp * 1000);

  return {
    email,
    exp,
    id,
    roles,
    get isValid() {
      const isValid = new Date() < expDate;
      if (!isValid) clearAuthToken();
      return isValid;
    },
  };
}
