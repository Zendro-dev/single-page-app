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
  cy.intercept('http://localhost:3000/login').as('login');
  cy.visit('/');
  cy.dataCy('login-button').click({ force: true });
  // fill out the inputs and click the button
  cy.dataCy('login-form-email').type('admin@zen.dro');
  cy.dataCy('login-form-password').type('admin');
  cy.dataCy('login-form-login').click();

  cy.wait('@login').then(({ request, response }) => {
    console.log({ request, response });
    const token = response?.body.token;
    cy.wrap(token).as('token');
    // console.log(window.localStorage.getItem('token'));
  });
  // console.log(token)
  // return token;
  // cy.log(localStorage.getItem('token') as string);
  // return window.localStorage.getItem('token');
});

Cypress.LocalStorage.clear = function (keys) {
  console.log('--Running LocalStorage.clear--');
  return;
};

Cypress.Commands.add('addDummyAlien', (token) => {
  const mutation = `mutation {
    addAlien(idField: "alien_test_update",
    stringField: "Xortacl",
    intField: 5,
    floatField: 2.45,
    datetimeField: "2021-05-01T06:43:30.000Z",
    booleanField: true,
    stringArrayField: ["my_first_string", "my_real_second_string"]){idField}}`;
  cy.request({
    url: 'http://localhost:3000/graphql',
    headers: {
      authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: { query: mutation },
    method: 'POST',
  });
});

Cypress.Commands.add('deleteDummyAlien', () => {
  cy.request({
    url: 'http://localhost:3000/graphql',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB6ZW4uZHJvIiwicm9sZXMiOlsiYWRtaW5pc3RyYXRvciIsInJlYWRlciIsImVkaXRvciIsImFjbF92YWxpZGF0aW9ucy1yb2xlIl0sImlhdCI6MTYyMjAyMDExNywiZXhwIjoxNjIyMDIzNzE3fQ.2By-n_eRlWBy9uhdwTuB4O53pf8iGMh7NBLbG7zU5gE',
    },
    body: `mutation{deleteAlien(idField: 'alien_test_update')}`,
    method: 'POST',
  });
});

export {};
