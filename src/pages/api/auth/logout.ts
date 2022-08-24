import type { NextApiRequest, NextApiResponse } from 'next';
import { BASEPATH } from '@/config/globals';

const OAUTH2_ISSUER = String(process.env.OAUTH2_ISSUER ?? '');
const NEXTAUTH_URL = String(process.env.NEXTAUTH_URL ?? '');
const LOGOUT_URL = String(process.env.OAUTH2_LOGOUT_URL ?? '');
const OAUTH2_CLIENT_ID = String(process.env.OAUTH2_CLIENT_ID ?? '');

const ORIGIN = `${new URL(NEXTAUTH_URL).origin}${BASEPATH}/`;

// Use OAUTH2_LOGOUT_URL in case you want to customize the logout endpoint of
// your provider. If not provided it will use the OAUTH2_ISSUER to build the
// Url.
const LOGOUT =
  LOGOUT_URL !== ''
    ? LOGOUT_URL
    : `${OAUTH2_ISSUER}/protocol/openid-connect/logout`;

export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.redirect(
    `${LOGOUT}?client_id=${OAUTH2_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(
      ORIGIN
    )}`
  );
};
