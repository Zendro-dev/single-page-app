import type { NextApiRequest, NextApiResponse } from 'next';
import { BASEPATH } from '@/config/globals';

const OAUTH2_ISSUER = String(process.env.OAUTH2_ISSUER ?? '');
const NEXTAUTH_URL = String(process.env.NEXTAUTH_URL ?? '');
const LOGOUT_URL = String(process.env.OAUTH2_LOGOUT_URL ?? '');
const OAUTH2_CLIENT_ID = String(process.env.OAUTH2_CLIENT_ID ?? '');
const BASE_URL = NEXTAUTH_URL.replace('/api/auth', '');

const ORIGIN = `${new URL(NEXTAUTH_URL).origin}${BASEPATH}/`;

const LOGOUT =
  LOGOUT_URL !== ''
    ? LOGOUT_URL
    : `${OAUTH2_ISSUER}/protocol/openid-connect/logout`;
console.log({ LOGOUT, LOGOUT_URL, ORIGIN, BASE_URL });
export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.redirect(
    `${LOGOUT}?client_id=${OAUTH2_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(
      ORIGIN
    )}`
  );
};
