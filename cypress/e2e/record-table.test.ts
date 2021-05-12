describe('record-table read', () => {
  // but set the user before visiting the page
  // so the app thinks it is already authenticated

  before('login', () => {
    cy.login();
  });

  after('logout', () => {
    cy.dataCy('login-button').click({ force: true });
  });

  it('Alien model table', () => {
    cy.visit('/models/alien');
    // check if the table has the expected data
    cy.dataCy('record-table-body').within(($tbody) => {
      cy.get('tr').should('have.length', 11).and('be.visible');
      cy.get('tr').eq(0).find('td').should('have.length', 14);
      cy.get('tr').eq(0).find('td').eq(3).should('eq', 'alien_1');
    });

    // sorting
  });
});

export {};
