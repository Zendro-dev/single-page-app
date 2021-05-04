describe('The Login Page', () => {
  it('successfull login', () => {
    cy.visit('/login');

    // fill out the inputs and click the button
    cy.dataCy('login-form-email').type('admin@zen.dro');
    cy.dataCy('login-form-password').type('admin');
    cy.dataCy('login-form-login').click();

    // check the url
    cy.url().should('include', '/models');
  });
});

export {};
