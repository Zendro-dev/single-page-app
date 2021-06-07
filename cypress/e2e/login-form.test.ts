import { AuthToken } from '@/types/auth';
import decode from 'jwt-decode';

describe('Login', () => {
  after('logout', () => {
    cy.dataCy('login-button').click({ force: true });
  });

  it('Wrong credentials display a login error', () => {
    cy.visit('/');
    cy.dataCy('login-button').click();

    // fill out the inputs and click the button
    cy.dataCy('login-form-email').type('admin@zen.dro');
    cy.dataCy('login-form-password').type('admn');
    cy.dataCy('login-form-login').click();
    // check if login failed info is visible
    cy.dataCy('login-dialog-login-failed').should('be.visible');
  });

  it('Successful login receives a valid token', () => {
    cy.visit('/');
    cy.dataCy('login-button').click();

    // fill out the inputs and click the button
    cy.dataCy('login-form-email').type('admin@zen.dro');
    cy.dataCy('login-form-password').type('admin');
    cy.dataCy('login-form-login').click();

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
          'reader',
          'editor',
          'acl_validations-role',
        ]);
      });
  });

  it('Logging out clears existing token', () => {
    cy.dataCy('login-button').click({ force: true });
    // cy.dataCy('login-button').click();

    cy.window().its('localStorage.token').should('not.exist');
  });
});

export {};
