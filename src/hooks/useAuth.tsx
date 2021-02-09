import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authSelector, logUserIn, logUserOut } from '../store/auth-slice';
import { AuthState } from '../types/auth';

interface AuthOptions {
  redirectTo?: string;
}

type AuthLogin = (
  email: string,
  password: string,
  options: AuthOptions
) => void;

type AuthLogout = (options: AuthOptions) => void;

interface UseAuth {
  auth: AuthState;
  login: AuthLogin;
  logout: AuthLogout;
}

export default function useAuth(): UseAuth {
  const [redirect, setRedirect] = useState<string>();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!redirect) return;

    const isLoggedIn = auth.user && auth.status === 'success';
    const isLoggedOut = !auth.user && auth.status === 'idle';

    if (isLoggedIn || isLoggedOut) history.push(redirect);
  }, [auth, history, redirect]);

  const login: AuthLogin = (email, password, options = {}) => {
    if (options.redirectTo) setRedirect(options.redirectTo);
    if (email && password) dispatch(logUserIn({ email, password }));
  };

  const logout: AuthLogout = (options = {}) => {
    if (options.redirectTo) setRedirect(options.redirectTo);
    dispatch(logUserOut());
  };

  return { auth, login, logout };
}
