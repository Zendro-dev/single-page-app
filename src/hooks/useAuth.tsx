import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { authSelector, logUserIn, logUserOut } from '../store/auth-slice';
import { AuthState } from '../types/auth';

interface AuthOptions {
  redirectTo: string;
  redirectIfFound?: boolean;
}
type AuthLogin = (email: string, password: string) => void;
type AuthLogout = () => void;

interface UseAuth {
  auth: AuthState;
  login: AuthLogin;
  logout: AuthLogout;
}

export default function useAuth(options?: AuthOptions): UseAuth {
  const { redirectTo, redirectIfFound } = options ?? {};
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // if no redirect needed, just return
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || auth.status === 'loading') return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !auth.user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && auth.user)
    ) {
      router.push(redirectTo);
    }
  }, [auth, redirectTo, redirectIfFound, router]);

  const login: AuthLogin = (email, password) => {
    if (email && password) dispatch(logUserIn({ email, password }));
  };

  const logout: AuthLogout = () => {
    dispatch(logUserOut());
  };

  return { auth, login, logout };
}
