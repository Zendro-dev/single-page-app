declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;

    /**
     * Custom command to login via the UI
     */
    login(): void;

    /**
     * Custom command to fire a graphql request via cy.request
     * @param query qraphql query as string
     * @example cy.gqlRequest('mutation{deleteCountry(country_id: "country_1")}')
     */
    gqlRequest(query: string): void;

    /**
     * Custom command to seed a default DB
     */
    seedDefaultDb(): void;

    /**
     * Custom command to reset the default seeded DB
     */
    resetDefaultDb(): void;
  }
}
