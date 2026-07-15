import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// graphql-server (gqs) owns authentication end to end - this app holds no
// Keycloak credentials of its own, it reverse-proxies to gqs the same way
// graphiql-auth already does (see graphql-server/README.md, "Acting as an
// auth backend for other origins"). This dev-server proxy mirrors
// server.js's production proxy so `npm run dev` behaves the same way
// without needing the separate Express server.
const GQS_ORIGIN = process.env.GQS_ORIGIN || 'http://localhost:3000';
// 8080 matches the rest of the stack's convention (docker-compose publishes
// this app on host port 8080, same as the original Next.js app's own
// default) - overridable via PORT for anyone running this standalone.
const DEV_PORT = Number(process.env.PORT) || 8080;
const DEV_ORIGIN = `http://localhost:${DEV_PORT}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: DEV_PORT,
    // Required for docker: the compose port mapping (8080:8080) only
    // reaches a server bound to all interfaces, not just loopback.
    host: true,
    proxy: {
      '/graphql': { target: GQS_ORIGIN, changeOrigin: true },
      '/meta_query': { target: GQS_ORIGIN, changeOrigin: true },
      '/auth': {
        target: GQS_ORIGIN,
        changeOrigin: true,
        // gqs resolves the redirect_uri to use per-request from this header
        // (see graphql-server/utils/auth/router.js's resolveRedirectUri) -
        // without it, /auth/login would send the browser back to gqs's own
        // origin instead of this app's. gqs must have this origin
        // registered in its own AUTH_REDIRECT_URI allowlist.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.url === '/auth/login' || req.url === '/auth/logout') {
              proxyReq.setHeader('x-zendro-auth-redirect-uri', `${DEV_ORIGIN}/auth/callback`);
            }
          });
        },
      },
    },
  },
});
