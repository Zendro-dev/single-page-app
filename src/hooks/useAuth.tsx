import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { authSelector, logUserIn, logUserOut } from '../store/auth-slice';
import { AuthState } from '@/types/auth';

interface AuthOptions {
  redirectTo: string;
  redirectIfFound?: boolean;
  redirectIfNotAllowed?: boolean;
}
type AuthLogin = (email: string, password: string) => void;
type AuthLogout = () => void;

interface UseAuth {
  auth: AuthState;
  login: AuthLogin;
  logout: AuthLogout;
}

export default function useAuth(options?: AuthOptions): UseAuth {
  const { redirectTo, redirectIfFound, redirectIfNotAllowed } = options ?? {};
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  const isAllowed = useCallback(() => {
    const model = router.query.model as string;

    const action = Object.keys(router.query).find((key) =>
      ['create', 'read', 'update'].includes(key)
    );

    return auth.user?.permissions[model]?.some(
      (x) => !action || x === action || x === '*'
    );
  }, [auth.user, router.query]);

  useEffect(() => {
    /**
     * Do not do anything if:
     * - No redirect needed
     * - User data not set because there is a fetch in progress
     */
    if (!redirectTo || auth.status === 'loading') return;

    if (
      /**
       * TOP PRECEDENCE: Redirect if only redirectTo is set and
       * a valid user was not found
       */
      (redirectTo && !redirectIfFound && !auth.user) ||
      /**
       * MID PRECEDENCE: Redirect if redirectIfFound is also set,
       * and a valid user was found
       */
      (redirectIfFound && auth.user) ||
      /**
       * BOTTOM PRECEDENCE: Redirect if redirectIfNotAllowed is also
       * set and the user does not have sufficient permissions
       */
      (redirectIfNotAllowed && auth.user && !isAllowed())
    ) {
      router.push(redirectTo);
    }
  }, [
    auth,
    isAllowed,
    redirectTo,
    redirectIfFound,
    redirectIfNotAllowed,
    router,
  ]);

  const login: AuthLogin = (email, password) => {
    if (email && password) dispatch(logUserIn({ email, password }));
  };

  const logout: AuthLogout = () => {
    dispatch(logUserOut());
  };

  return { auth, login, logout };
}
