declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;

    login(): string;

    addDummyAlien(token: string): void;

    deleteDummyAlien(token: string): void;

    // setAuthSession(): void;
  }
}
