import { AuthToken } from '@/types/auth';
import decode from 'jwt-decode';

describe('Login form', () => {
  after('Logout', () => {
    cy.dataCy('login-button').click({ force: true });
  });

  it('Receive a login error after a failed login', () => {
    // Navigate to the application home page
    cy.visit('/');

    // Fill and submit the login form
    cy.dataCy('login-button').click();
    cy.dataCy('login-form-email').type('admin@zen.dro');
    cy.dataCy('login-form-password').type('admn');
    cy.dataCy('login-form-login').click();

    // Verify that the error toast is visible
    // ! Needs to check the response
    cy.dataCy('login-dialog-login-failed').should('be.visible');
  });

  it('Receive a valid token after a successful login', () => {
    // Navigate to application home page
    cy.visit('/');

    // Fill and submit the login form
    cy.dataCy('login-button').click();
    cy.dataCy('login-form-email').type('admin@zen.dro');
    cy.dataCy('login-form-password').type('admin');
    cy.dataCy('login-form-login').click();

    // Verify the success response
    cy.window()
      .its('localStorage.token')
      .should('exist')
      .then(() => {
        // get the token from localStorage
        const token = window.localStorage.getItem('token');
        expect(token).to.be.a('string');

        // check the decoded token for the correct email and roles
        const decodedToken = decode(token as string) as AuthToken;
        expect(decodedToken.email).to.equal('admin@zen.dro');
        expect(decodedToken.roles).to.deep.equal([
          'administrator',
          'editor',
          'reader',
        ]);
      });
  });

  it('Clear the existing token after logout', () => {
    cy.dataCy('login-button').click({ force: true });
    cy.window().its('localStorage.token').should('not.exist');
  });
});

export {};
