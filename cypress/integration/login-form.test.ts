describe('The Login Page', () => {
  it('successfull login', () => {
    cy.visit('/login');
    cy.get('[data-cy=login-form-email]').type('admin@zen.dro');
    cy.get('[data-cy=login-form-password]').type('admin');
    cy.get('[data-cy=login-form-login]').click();

    // check the url
    cy.url().should('include', '/home');
  });
});

export {};
