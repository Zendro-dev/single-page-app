// Rewritten for the cookie-based auth architecture (graphql-server owns
// login entirely now, see graphql-server/utils/auth/). There's no local
// login form anymore, no client-visible JWT, and no localStorage token -
// login is a full-page redirect to Keycloak's own hosted login page, and the
// resulting session lives in an httpOnly cookie the browser never exposes to
// JS. What's left to test from this app's side is: clicking login reaches
// Keycloak, a real Keycloak login round-trip flips the app into its
// authenticated UI state, and logout clears it again.
//
// Interacting with the Keycloak page goes through cy.origin() - Keycloak's
// session cookies are Secure + SameSite=None, which a real browser won't
// carry across a plain cross-origin navigation (see commands.ts's login()
// for the full explanation); cy.origin() is Cypress's supported way to
// drive a genuinely different origin within one test.
//
// testIsolation is forced back on for this file specifically (project-wide
// default is off, see cypress.config.ts - the other 3 specs rely on auth
// persisting across tests via a single before-hook login). Each test here
// calls cy.login() fresh, and successive cy.origin() calls across tests
// without an isolation reset in between can leave Cypress's origin
// tracking confused about which origin the next command should target.
describe('Login form', { testIsolation: true }, () => {
  it('Redirects to the Keycloak login page when clicking login', () => {
    cy.visit('/');
    cy.dataCy('login-button').click({ force: true });

    cy.origin('http://localhost:8082', () => {
      cy.url().should('include', '/realms/zendro');
      cy.get('#username').should('be.visible');
      cy.get('#password').should('be.visible');
    });
  });

  it('Shows an error on Keycloak for invalid credentials', () => {
    cy.visit('/');
    cy.dataCy('login-button').click({ force: true });

    cy.origin('http://localhost:8082', () => {
      cy.get('#username', { timeout: 10000 }).type('zendro-admin');
      cy.get('#password').type('not-the-right-password');
      cy.get('#kc-login').click();

      // Stays on Keycloak's own login page and shows its own error - this
      // never reaches the app, so there's no app-side data-cy for it.
      cy.url().should('include', '/realms/zendro');
      cy.get('.kc-feedback-text', { timeout: 10000 }).should('be.visible');
    });
  });

  it('Reaches an authenticated UI state after a successful login', () => {
    cy.login();

    // authenticated === true: logout icon replaces the login icon, and the
    // Models nav link (hidden while logged out) becomes visible.
    cy.dataCy('login-button').should('be.visible');
    cy.dataCy('nav-models').should('be.visible');

    cy.request('/auth/session').then(({ body }) => {
      expect(body.authenticated).to.eq(true);
    });
  });

  it('Clears the authenticated state after logout', () => {
    cy.login();
    cy.dataCy('login-button').click({ force: true });

    // logout() is a full-page navigation to /auth/logout, which redirects
    // back to this app once the session cookie is cleared.
    cy.location('origin', { timeout: 10000 }).should(
      'eq',
      'http://localhost:8080'
    );
    cy.dataCy('nav-models').should('not.exist');

    cy.request('/auth/session').then(({ body }) => {
      expect(body.authenticated).to.eq(false);
    });
  });
});

export {};
