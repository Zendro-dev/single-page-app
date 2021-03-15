import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { authSelector, logUserIn, logUserOut } from '../store/auth-slice';
import { AuthState } from '@/types/auth';
import useRedirect from './useRedirect';
import { parseUrlQuery } from '@/utils/router';
import { PathParams } from '@/types/models';

interface AuthOptions {
  redirectTo: string;
  redirectIfFound?: boolean;
  redirectIfNotAllowed?: boolean;
  redirectTimeout?: number;
}
type AuthLogin = (email: string, password: string) => void;
type AuthLogout = () => void;

interface UseAuth {
  auth: AuthState;
  login: AuthLogin;
  logout: AuthLogout;
  isAllowed: boolean;
  redirectTimer: number;
}

export default function useAuth(options?: AuthOptions): UseAuth {
  const { redirectTo, redirectIfFound, redirectIfNotAllowed, redirectTimeout } =
    options ?? {};
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  const { redirect, redirectTimer } = useRedirect({
    redirectTo,
    redirectTimeout,
  });

  /**
   * Compute whether the user has permissions to access the
   * current resource
   */
  const isAllowed = useMemo(() => {
    const { model, request } = parseUrlQuery(
      router.asPath,
      router.query as PathParams
    );

    if (!model) return true;

    const allowed = auth.user?.permissions[model]?.some(
      (x) => !request || x === request || x === '*'
    );

    return allowed ?? false;
  }, [auth.user, router.asPath, router.query]);

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
       * TOP PRECEDENCE: Redirect if only redirectTo is set and
       * a valid user was not found
       */
      const onUserNotFound = !auth.user && !redirectIfFound;
      /**
       * MID PRECEDENCE: Redirect if redirectIfFound is also set,
       * and a valid user was found
       */
      const onUserFound = auth.user && redirectIfFound;
      /**
       * BOTTOM PRECEDENCE: Redirect if redirectIfNotAllowed is also
       * set and the user does not have sufficient permissions
       */
      const onUserNotAllowed = auth.user && redirectIfNotAllowed && !isAllowed;

      if (onUserNotFound || onUserFound || onUserNotAllowed) {
        redirect(redirectTo);
      }
    },
    [
      auth,
      isAllowed,
      redirect,
      redirectTo,
      redirectIfFound,
      redirectIfNotAllowed,
      redirectTimeout,
      router,
    ]
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

  return { auth, login, logout, isAllowed, redirectTimer };
}
