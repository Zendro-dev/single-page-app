import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authSelector,
  expireUser,
  logUserIn,
  logUserOut,
} from '@/store/auth-slice';
import { AuthState } from '@/types/auth';

interface AuthOptions {
  redirectTo: string;
  redirectIfFound?: boolean;
}
type AuthValid = () => boolean;
type AuthLogin = (email: string, password: string) => void;
type AuthLogout = () => void;

interface UseAuth {
  auth: AuthState;
  checkValidToken: AuthValid;
  login: AuthLogin;
  logout: AuthLogout;
}

export default function useAuth(options?: AuthOptions): UseAuth {
  const { redirectTo, redirectIfFound } = options ?? {};
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(authSelector);

  /**
   * Redirect a user depending on the hook options
   */
  useEffect(
    function redirectUser() {
      /**
       * Do not do anything if:
       * - No redirect needed
       * - User data not set because there is a fetch in progress
       */
      if (!redirectTo || auth.status === 'loading') return;

      /**
       * Redirect if only redirectTo is set and a valid user was not found
       */
      const onUserNotFound = !auth.user && !redirectIfFound;
      /**
       * Redirect if redirectIfFound is also set, and a valid user was found
       */
      const onUserFound = auth.user && redirectIfFound;

      if (onUserNotFound || onUserFound) {
        router.push(redirectTo);
      }
    },
    [auth, redirectTo, redirectIfFound, router]
  );

  /**
   * Dispatch a login action to the store. The action will attempt to
   * retrieve the user credentials and update the store accordingly.
   * @param email user email
   * @param password user password
   */
  const login: AuthLogin = (email, password) => {
    if (email && password) dispatch(logUserIn({ email, password }));
  };

  /**
   * Dispatch a logout action to the store. The action will reset the
   * local user credentials and update the store accordingly.
   */
  const logout: AuthLogout = () => {
    dispatch(logUserOut());
  };

  /**
   * Check whether the user exists and has a valid token.
   * - If no user is found, return false.
   * - If the token date has expired, dispatch an action to set the
   *   auth status to expired and return false.
   * - Otherwise return true.
   */
  const checkValidToken: AuthValid = useCallback(() => {
    if (!auth.user) return false;

    const currDate = new Date();
    const expDate = new Date(auth.user?.exp * 1000);
    if (currDate > expDate) {
      dispatch(expireUser());
      return false;
    }

    return true;
  }, [auth.user, dispatch]);

  return { auth, checkValidToken, login, logout };
}
