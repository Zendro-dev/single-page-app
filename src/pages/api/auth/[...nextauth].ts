import NextAuth from 'next-auth';
import { getUserPermissions } from '@/utils/auth';
import { JWT } from 'next-auth/jwt';
import { ROLES_URL } from '@/config/globals';

const OAUTH2_ISSUER = String(process.env.OAUTH2_ISSUER ?? '');
const OAUTH2_TOKEN_URI = String(process.env.OAUTH2_TOKEN_URI ?? '');
const OAUTH2_CLIENT_ID = String(process.env.OAUTH2_CLIENT_ID ?? '');
const OAUTH2_CLIENT_SECRET = String(process.env.OAUTH2_CLIENT_SECRET ?? '');

if (!OAUTH2_TOKEN_URI || !OAUTH2_CLIENT_ID || !OAUTH2_CLIENT_SECRET) {
  throw new Error(
    'Some mandatory OAuth2 variables in your `.env` are not being set'
  );
}

async function getRolesFromToken(token: string): Promise<string[]> {
  const rolesResponse = await fetch(ROLES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  const resBody = await rolesResponse.json();
  return resBody.roles;
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const formParameters = new URLSearchParams({
      client_id: String(OAUTH2_CLIENT_ID ?? ''),
      client_secret: OAUTH2_CLIENT_SECRET as string,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken ?? '',
    });

    const response = await fetch(OAUTH2_TOKEN_URI, {
      body: formParameters,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    // Confirm permissions
    const roles = await getRolesFromToken(refreshedTokens.access_token);
    const user = token.name;
    const permissions = user
      ? await getUserPermissions(user, roles)
      : undefined;

    return {
      ...token,
      permissions: permissions,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  secret: 'my-secret',
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    {
      id: 'zendro',
      name: 'zendro',
      type: 'oauth',
      wellKnown: `${OAUTH2_ISSUER}/.well-known/openid-configuration`, // OpenID spec
      clientId: OAUTH2_CLIENT_ID,
      clientSecret: OAUTH2_CLIENT_SECRET,
      checks: ['state', 'pkce'],
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
        };
      },
    },
  ],
  // debug: true,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial login
      if (account && account?.access_token && user) {
        token.accessToken = account.access_token;
        token.acccessTokenExpires = Date.now() + account.expires_in * 1000;
        token.refreshToken = account.refresh_token;
        // get roles from token
        const roles = await getRolesFromToken(account.access_token);
        if (roles && token.name) {
          const permissions = await getUserPermissions(token.name, roles);
          token.permissions = permissions;
        }
        return token;
      }
      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - 60 * 1000
      ) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.permissions = token.permissions;
      session.roles = token.roles;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
});
