import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 6000,
  video: false,
  screenshotOnRunFailure: false,
  env: {
    'keycloak-username': 'zendro-admin',
    'keycloak-password': 'admin',
  },
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.test.ts',
    // Auth persists across tests within a spec file via the (before-hook
    // driven) login/logout pattern each spec uses, not per-test - Cypress's
    // default per-test cookie/storage reset would break that.
    testIsolation: false,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
