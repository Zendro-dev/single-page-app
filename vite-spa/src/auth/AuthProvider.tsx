import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Client-side session/permissions state, mirroring zendro-graphiql's
// AuthToolbarButton.jsx pattern and the same shape as next-auth's
// useSession()/signIn()/signOut() - a same-origin fetch to check login state
// on load, and plain full-page navigations for login/logout (the session
// cookie is SameSite=Lax, so it isn't sent on cross-site fetch/XHR - only on
// top-level navigations - see graphql-server/README.md).
export type AclPermission = 'create' | 'read' | 'update' | 'delete' | '*';
export type AuthPermissions = Record<string, AclPermission[]>;

interface AuthContextValue {
  // null = still checking; only ever true/false once resolved.
  authenticated: boolean | null;
  permissions: AuthPermissions;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [permissions, setPermissions] = useState<AuthPermissions>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let isAuthenticated = false;
      try {
        const res = await fetch('/auth/session');
        const data = await res.json();
        isAuthenticated = Boolean(data.authenticated);
      } catch {
        isAuthenticated = false;
      }
      if (cancelled) return;
      setAuthenticated(isAuthenticated);

      if (!isAuthenticated) {
        setPermissions({});
        return;
      }
      try {
        const res = await fetch('/auth/permissions');
        const data = res.ok ? await res.json() : {};
        if (!cancelled) setPermissions(data);
      } catch {
        if (!cancelled) setPermissions({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value: AuthContextValue = {
    authenticated,
    permissions,
    login: () => {
      window.location.href = '/auth/login';
    },
    logout: () => {
      window.location.href = '/auth/logout';
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
