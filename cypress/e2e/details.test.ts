import { AuthToken } from '@/types/auth';
import decode from 'jwt-decode';

describe('Record details', () => {
  before('login', () => {
    cy.login();
  });

  after('logout', () => {
    cy.dataCy('login-button').click({ force: true });
  });

  // beforeEach('intercept requests', () => {
  //   cy.intercept('http://localhost:3000/graphql').as('read');
  //   cy.visit('/models/country/details?id=country_1');

  //   // Wait for inital requests
  //   cy.wait('@read').then(({ request, response }) => {
  //     expect(response?.statusCode).to.eq(200);
  //   });
  // });

  it('Cancel Form', () => {
    cy.visit('/models/country/details?id=country_1');

    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');
  });

  it('record country_1 details page', () => {
    cy.intercept('http://localhost:3000/graphql').as('read');
    cy.visit('/models/country/details?id=country_1');

    // Wait for inital requests
    cy.wait('@read').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        readOneCountry: {
          country_id: 'country_1',
          name: 'germany',
        },
      });
    });

    // refetch data
    cy.dataCy('record-form-reload').click();
    cy.wait('@read').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        readOneCountry: {
          country_id: 'country_1',
          name: 'germany',
        },
      });
    });

    cy.dataCy('record-form-udpate').click();
    cy.url().should('include', '/models/country/edit?id=country_1');
  });

  it.only('Record details associations', () => {
    cy.intercept('http://localhost:3000/graphql').as('read-record');
    cy.intercept('http://localhost:3000/meta_query', (req) => {
      if ((req.body.query as string).includes('countFiltered')) {
        req.alias = 'count-assoc-table';
      } else if ((req.body.query as string).includes('read')) {
        req.alias = 'read-assoc-table';
      }
    });

    // Wait for inital requests
    cy.visit('/models/country/details?id=country_1');

    // click on Associations tab
    cy.get('span').contains('Associations').click();

    // check initial request for the first association of country (unique_capital)
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      // check request variables
      expect(request.body.variables).to.deep.eq({
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        country_id: 'country_1',
        assocSearch: {
          field: 'country_id',
          value: 'country_1',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        records: [
          {
            capital_id: 'capital_1',
            name: 'berlin',
          },
        ],
      });
    });

    // select the rivers association
    cy.dataCy('country-association-select').click();
    cy.dataCy('country-association-select-rivers').click();

    // check the request / resonse
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      // check request variables
      expect(request.body.variables).to.deep.eq({
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        country_id: 'country_1',
        assocSearch: {
          field: 'country_id',
          value: 'country_1',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        pageInfo: {
          startCursor:
            'eyJuYW1lIjoicmhpbmUiLCJsZW5ndGgiOjEwMDAsInJpdmVyX2lkIjoicml2ZXJfMSIsImNvdW50cnlfaWRzIjpbImNvdW50cnlfMSIsImNvdW50cnlfNSIsImNvdW50cnlfNiJdfQ==',
          endCursor:
            'eyJuYW1lIjoiZGFudWIiLCJsZW5ndGgiOjIwMDAsInJpdmVyX2lkIjoicml2ZXJfMiIsImNvdW50cnlfaWRzIjpbImNvdW50cnlfMSJdfQ==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        records: [
          {
            river_id: 'river_1',
            name: 'rhine',
            length: 1000,
          },
          {
            river_id: 'river_2',
            name: 'danub',
            length: 2000,
          },
        ],
      });
    });

    cy.wait('@count-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(2);
    });

    /* SEARCH */
    cy.dataCy('model-table-search-field').type('rhine');
    cy.dataCy('model-table-search-button').click();

    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'or',
          search: [
            {
              field: 'river_id',
              value: '%rhine%',
              operator: 'like',
            },
            {
              field: 'name',
              value: '%rhine%',
              operator: 'like',
            },
          ],
        },
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        country_id: 'country_1',
        assocSearch: {
          field: 'country_id',
          value: 'country_1',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'or',
          search: [
            {
              field: 'river_id',
              value: '%rhine%',
              operator: 'like',
            },
            {
              field: 'name',
              value: '%rhine%',
              operator: 'like',
            },
          ],
        },
        country_id: 'country_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(1);
    });

    // change association while search field is non-empty
    cy.dataCy('country-association-select').click();
    cy.dataCy('country-association-select-continent').click();

    cy.wait('@read-assoc-table').then(({ request, response }) => {
      console.log({ request, response });
      expect(response?.statusCode).to.eq(200);
      // This behaviour
      expect(response?.body.data.records).to.deep.eq([
        {
          continent_id: null,
          name: null,
        },
      ]);
    });
  });
});

export {};
