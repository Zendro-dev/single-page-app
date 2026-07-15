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
const DEV_PORT = 5174;
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
