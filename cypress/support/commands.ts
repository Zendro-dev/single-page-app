// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', () => {
  // cy.intercept('http://localhost:3000/login').as('login');
  cy.visit('/');
  cy.dataCy('login-button').click({ force: true });
  // fill out the inputs and click the button
  cy.dataCy('login-form-email').type('admin@zen.dro');
  cy.dataCy('login-form-password').type('admin');
  cy.dataCy('login-form-login').click();
});

Cypress.LocalStorage.clear = function (keys) {
  console.log('--Running LocalStorage.clear--');
  return;
};

Cypress.Commands.add('gqlRequest', (query) => {
  cy.request({
    url: 'http://localhost:3000/login',
    body: { email: 'admin@zen.dro', password: 'admin' },
    method: 'POST',
  }).then((response) => {
    // console.log({ response });
    cy.request({
      url: 'http://localhost:3000/graphql',
      headers: {
        authorization: 'Bearer ' + response.body.token,
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: { query },
      method: 'POST',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

export {};
