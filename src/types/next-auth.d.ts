import { AuthPermissions } from './auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      /** The user's postal address. */
      name?: string;
    };
    accessToken?: string;
    accessTokenExpires?: number;
    expires?: string;
    permissions?: AuthPermissions;
    roles?: string[];
    error?: string;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    expires_in: number;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;

    name?: string;
    sub?: string;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    permissions?: AuthPermissions;
    roles?: string[];
    error?: string;
  }
}
