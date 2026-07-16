// Bootstraps the Keycloak realm/clients for the e2e test environment and
// writes the resulting OAuth2 config into test/config/.env - must run
// AFTER Keycloak is up but BEFORE graphql-server's container starts,
// since server.js only ever reads its .env once, at process boot (see
// testenv_docker_up.sh, which sequences this in between).
//
// Reuses graphql-server's own utils/setup-keycloak.js (from the freshly
// cloned test_env instance, not this repo) rather than reimplementing the
// realm/client creation - same helper graphql-server's own live-login test
// suite and this session's spike verifications already relied on.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEST_DIR = __dirname;
const GRAPHQL_SERVER_DIR = path.join(TEST_DIR, 'test_env', 'gql_science_db_graphql_server1');
const ENV_PATH = path.join(TEST_DIR, 'config', '.env');

const KEYCLOAK_ORIGIN = 'http://localhost:8082';
// The browser and this bootstrap script (running on the host) reach
// Keycloak via its published port, but graphql-server's own container needs
// the Compose service's internal DNS name instead - "localhost" from inside
// that container refers to the container itself, not the host.
const KEYCLOAK_INTERNAL_ORIGIN = 'http://keycloak:8082';
const SPA_ORIGIN = `http://localhost:${process.env.PORT || 8080}`;
const GQS_ORIGIN = 'http://localhost:3000';

process.env.OAUTH2_TOKEN_URI = `${KEYCLOAK_ORIGIN}/auth/realms/zendro/protocol/openid-connect/token`;
process.env.AUTH_REDIRECT_URI = `${GQS_ORIGIN}/auth/callback,${SPA_ORIGIN}/*`;
process.env.SPA_REDIRECT_URI = `${SPA_ORIGIN}/*`;
// config/globals.js throws at require-time if this is unset - it's the only
// hard-mandatory var, and doesn't affect anything setupKeyCloak() actually
// reads (AUTH_REDIRECT_URI/SPA_REDIRECT_URI/OAUTH2_TOKEN_URI above), so any
// truthy value satisfies the check for this one-off bootstrap process.
process.env.ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*';

const { setupKeyCloak } = require(path.join(GRAPHQL_SERVER_DIR, 'utils', 'setup-keycloak'));

function randSecret() {
  return crypto.randomBytes(32).toString('base64');
}

setupKeyCloak()
  .then(({ KEYCLOAK_PUBLIC_KEY, KEYCLOAK_GIQL_CLIENT_SECRET }) => {
    const lines = [
      `ALLOW_ORIGIN="*"`,
      `MAIL_ACCOUNT="sci.db.service@gmail.com"`,
      `MAIL_HOST="smtp.gmail.com"`,
      `MAIL_PASSWORD="SciDbServiceQAZ"`,
      `MAIL_SERVICE="gmail"`,
      `JWT_SECRET="something-secret"`,
      `AUTH_ENABLED="true"`,
      `GRAPHIQL_FILTER_ENABLED="false"`,
      `OAUTH2_TOKEN_URI="${process.env.OAUTH2_TOKEN_URI}"`,
      `OAUTH2_CLIENT_ID="zendro_graphql-server"`,
      `OAUTH2_PUBLIC_KEY="${KEYCLOAK_PUBLIC_KEY}"`,
      `OAUTH2_GRAPHIQL_CLIENT_ID="zendro_graphiql"`,
      `OAUTH2_GRAPHIQL_CLIENT_SECRET="${KEYCLOAK_GIQL_CLIENT_SECRET}"`,
      `OAUTH2_GRAPHIQL_ISSUER_URI="${KEYCLOAK_ORIGIN}/auth/realms/zendro"`,
      `OAUTH2_GRAPHIQL_ISSUER_INTERNAL_URI="${KEYCLOAK_INTERNAL_ORIGIN}/auth/realms/zendro"`,
      `SESSION_SECRET="${randSecret()}"`,
      `AUTH_REDIRECT_URI="${process.env.AUTH_REDIRECT_URI}"`,
      `SPA_REDIRECT_URI="${process.env.SPA_REDIRECT_URI}"`,
      '',
    ].join('\n');

    fs.writeFileSync(ENV_PATH, lines);
    console.log(`Wrote ${ENV_PATH} with real Keycloak config.`);
  })
  .catch((err) => {
    console.error('Keycloak bootstrap failed:', err);
    process.exit(1);
  });
