import { gql } from 'graphql-request';

describe('Record association page', () => {
  before('Login and seed database', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('Logout and reset database', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  beforeEach('Add test data and intercept requests', () => {
    // Add a test country and capital record
    cy.gqlRequest(gql`
      mutation {
        addCountry(country_id: "country_test_update", name: "belgium") {
          country_id
        }
        addCapital(capital_id: "capital_test_update", name: "brussels") {
          capital_id
        }
      }
    `);

    // Intercept standard graphql requests
    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('update')) {
        req.alias = 'update-record';
      }
    });

    // Intercept meta_query graphql requests
    // ! Needs a better check
    cy.intercept('http://localhost:3000/meta_query', (req) => {
      if (
        (req.body.query as string).match('countFiltered[A-Z][a-z]+\\s*\\(') ||
        (req.body.query as string).match('count[A-Z][a-z]+\\(')
      ) {
        req.alias = 'count-assoc-table';
      } else {
        req.alias = 'read-assoc-table';
      }
    });
  });

  afterEach('Cleanup test data', () => {
    cy.gqlRequest(gql`
      mutation {
        updateCountry(
          country_id: "country_test_update"
          removeUnique_capital: "capital_test_update"
          removeContinent: "continent_1"
          removeRivers: ["river_1", "river_2"]
        ) {
          country_id
        }
        deleteCountry(country_id: "country_test_update")
        deleteCapital(capital_id: "capital_test_update")
      }
    `);
  });

  it('Querying associations of a non-existing record throws', () => {
    // Navigate to country->unique_capital associations page
    cy.visit(
      '/models/country/details/unique_capital?id=this-country-does-not-exist'
    );

    // Verify the error response
    cy.wait('@read-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.errors).to.deep.eq([
        {
          message:
            'Record with ID = "this-country-does-not-exist" does not exist',
          locations: [
            {
              line: 2,
              column: 72,
            },
          ],
          path: ['readOneCountry'],
        },
      ]);
    });
  });

  it('Can view and search the associations of an existing record', () => {
    // Navigate to country->unique_capital association page
    cy.visit('/models/country/details/unique_capital?id=country_1');

    /* FETCH ASSOCIATION DATA */

    // Verify request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
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

    // Navigate to country->rivers association page
    cy.visit('/models/country/details/rivers?id=country_1');

    // Verify request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
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
            'eyJuYW1lIjoicmhpbmUiLCJsZW5ndGgiOjEwMDAsInJpdmVyX2lkIjoicml2ZXJfMSIsImNvdW50cnlfaWRzIjpbImNvdW50cnlfMSIsImNvdW50cnlfNSIsImNvdW50cnlfNiJdLCJjaXR5X2lkcyI6W119',
          endCursor:
            'eyJuYW1lIjoiZGFudWIiLCJsZW5ndGgiOjIwMDAsInJpdmVyX2lkIjoicml2ZXJfMiIsImNvdW50cnlfaWRzIjpbImNvdW50cnlfMSJdLCJjaXR5X2lkcyI6W119',
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

    /* SEARCH ASSOCIATIONS */

    cy.dataCy('model-table-search-field').type('rhine');
    cy.dataCy('model-table-search-button').click();

    // Verify request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'or',
          search: [
            {
              field: 'river_id',
              value: '%rhine%',
              operator: 'iLike',
            },
            {
              field: 'name',
              value: '%rhine%',
              operator: 'iLike',
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
              operator: 'iLike',
            },
            {
              field: 'name',
              value: '%rhine%',
              operator: 'iLike',
            },
          ],
        },
        country_id: 'country_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(1);
    });
  });

  it('Can add new and remove existing associations', () => {
    // navigate to country->unique_capital association page
    cy.visit('/models/country/edit/unique_capital?id=country_test_update');

    /* FETCH ASSOCIATION DATA */

    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        country_id: 'country_test_update',
        assocSearch: {
          field: 'country_id',
          value: 'country_test_update',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    /* ADD NEW ASSOCIATIONS */

    // Associate test_country to test_capital
    cy.dataCy('associations-table-mark-capital_test_update').click();
    cy.dataCy('associations-table-submit').click();

    // Verify the mutation request and sucessful response
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addUnique_capital: 'capital_test_update',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        updateCountry: {
          country_id: 'country_test_update',
          name: 'belgium',
        },
      });
    });

    // Verify the revalidation successful response
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    cy.wait(2000);

    /* REMOVE EXISTING ASSOCIATIONS */

    // Disassociate test_country to test_capital
    cy.dataCy('associations-table-mark-capital_test_update').click();
    cy.dataCy('associations-table-submit').click();

    // Verify the mutation request and sucessful response
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        removeUnique_capital: 'capital_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });

    // Verify the revalidation successful response
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );
  });

  it('Can modify existing associations', () => {
    // navigate to country->continent association page
    cy.visit('/models/country/edit/continent?id=country_test_update');

    /* FETCH ASSOCIATION TABLE DATA */

    // cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
    //   ([read, count]) => {
    //     expect(read.response?.statusCode).to.eq(200);
    //     expect(count.response?.statusCode).to.eq(200);
    //   }
    // );

    /* ADD NEW ASSOCIATION */

    // Associate test_country to continent_2
    cy.dataCy('associations-table-mark-continent_2').click();
    cy.dataCy('associations-table-submit').click();

    // Verify the mutation request and sucessful response
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addContinent: 'continent_2',
      });
      expect(response?.statusCode).to.eq(200);
    });

    // // Verify the revalidation successful response
    // cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
    //   ([read, count]) => {
    //     expect(read.response?.statusCode).to.eq(200);
    //     expect(count.response?.statusCode).to.eq(200);
    //   }
    // );

    cy.wait(2000);

    /* MODIFY THE ASSOCIATION TO A DIFFERENT RECORD */

    // Reassociate to another continent
    cy.dataCy('associations-table-mark-continent_1').click();
    cy.dataCy('associations-table-submit').click();

    // Verify the mutation request and sucessful response
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addContinent: 'continent_1',
        removeContinent: 'continent_2', // old association needs to be removed
      });
      expect(response?.statusCode).to.eq(200);
    });

    // // Verify the revalidation successful response
    // cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
    //   ([read, count]) => {
    //     expect(read.response?.statusCode).to.eq(200);
    //     expect(count.response?.statusCode).to.eq(200);
    //   }
    // );
  });

  it('Can add multiple associations', () => {
    // navigate to country->rivers association page
    cy.visit('/models/country/edit/rivers?id=country_test_update');

    /* FETCH ASSOCIATION TABLE DATA */

    // cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
    //   ([read, count]) => {
    //     expect(read.response?.statusCode).to.eq(200);
    //     expect(count.response?.statusCode).to.eq(200);
    //   }
    // );

    /* ADD MULTIPLE ASSOCIATIONS */

    // Associate test_country to river_1 and river_2
    cy.dataCy('associations-table-mark-river_1').click();
    cy.dataCy('associations-table-mark-river_2').click();
    cy.dataCy('associations-table-submit').click();

    // Verify the mutation request and sucessful response
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addRivers: ['river_1', 'river_2'],
      });
      expect(response?.statusCode).to.eq(200);
    });

    // // Verify the revalidation successful response
    // cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
    //   ([read, count]) => {
    //     expect(read.response?.statusCode).to.eq(200);
    //     expect(count.response?.statusCode).to.eq(200);
    //   }
    // );
  });

  it('Can filter one-to-one associated records', () => {
    // Navigate to country->unique_capital association page
    cy.visit('/models/country/edit/unique_capital?id=country_1');

    /* FETCH ASSOCIATION TABLE DATA */

    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    /* FILTER ASSOCIATED RECORDS */

    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-associated').click();

    // Verify the mutation request and sucessful response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
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

    cy.wait(2000);

    /* RESET FILTERS */

    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-no-filter').click();

    // Verify the revalidation success response
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );
  });

  it('Can filter and search many-to-many (foreign key arrays) associated records', () => {
    // Navigate to country->rivers association page
    cy.visit('/models/country/edit/rivers?id=country_1');

    /* FETCH ASSOCIATION TABLE DATA */

    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.body.data.records).to.deep.eq([
          {
            river_id: 'river_1',
            name: 'rhine',
            length: 1000,
            countriesConnection: {
              country_id: 'country_1',
            },
          },
          {
            river_id: 'river_2',
            name: 'danub',
            length: 2000,
            countriesConnection: {
              country_id: 'country_1',
            },
          },
          {
            river_id: 'river_3',
            name: 'guadalquivir',
            length: 12000,
            countriesConnection: null,
          },
        ]);
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    /* FILTER ASSOCIATED RECORDS */

    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-associated').click();

    // Verify the request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
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
    });

    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(2);
    });

    /* MARK RECORDS */

    // Mark river_1 for disassociation
    cy.dataCy('associations-table-mark-river_1').click();
    cy.dataCy('associations-table-mark-river_2').click();

    // Select records-to-remove filter
    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-records-to-remove').click();

    // Verify the request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          field: 'river_id',
          value: 'river_1,river_2',
          valueType: 'Array',
          operator: 'in',
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

    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.body.data.count).to.eq(2);
    });

    /* SEARCH RECORDS */

    // Add an additional search parameter
    cy.dataCy('model-table-search-field').type('rhine');
    cy.dataCy('model-table-search-button').click();

    // Verify the request and sucess response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'and',
          search: [
            {
              operator: 'or',
              search: [
                {
                  field: 'river_id',
                  value: '%rhine%',
                  operator: 'iLike',
                },
                {
                  field: 'name',
                  value: '%rhine%',
                  operator: 'iLike',
                },
              ],
            },
            {
              field: 'river_id',
              value: 'river_1,river_2',
              valueType: 'Array',
              operator: 'in',
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

    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.body.data.count).to.eq(1);
    });
  });

  it('Can filter, search, and sort many-to-one associated records', () => {
    // Navigate to continent->countries association page
    cy.visit('/models/continent/edit/countries?id=continent_1');

    /* FETCH ASSOCIATION TABLE DATA */

    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        continent_id: 'continent_1',
        assocSearch: {
          field: 'continent_id',
          value: 'continent_1',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.deep.eq([
        {
          country_id: 'country_1',
          name: 'germany',
          continent: {
            continent_id: 'continent_1',
          },
        },
        {
          country_id: 'country_2',
          name: 'spain',
          continent: {
            continent_id: 'continent_1',
          },
        },
        {
          country_id: 'country_3',
          name: 'mexico',
          continent: {
            continent_id: null,
          },
        },
        {
          country_id: 'country_4',
          name: 'china',
          continent: {
            continent_id: null,
          },
        },
        {
          country_id: 'country_5',
          name: 'netherlands',
          continent: {
            continent_id: 'continent_1',
          },
        },
        {
          country_id: 'country_6',
          name: 'france',
          continent: {
            continent_id: 'continent_1',
          },
        },
        {
          country_id: 'country_test_update',
          name: 'belgium',
          continent: null,
        },
      ]);
    });

    cy.wait('@count-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        continent_id: 'continent_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        count: 7,
      });
    });

    /* FILTER ASSOCIATED RECORDS */

    cy.dataCy('continent-association-filters').click();
    cy.dataCy('continent-association-filters-associated').click();

    // Verify request and success response
    cy.wait('@read-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        count: 4,
      });
    });

    /* SEARCH RECORDS */

    cy.dataCy('model-table-search-field').type('er');
    cy.dataCy('model-table-search-button').click();

    // Verify request and success response
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    /* SORT RECORDS */

    cy.dataCy('table-header-column-name').click();

    // Verify request and success response
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'or',
          search: [
            {
              field: 'country_id',
              value: '%er%',
              operator: 'iLike',
            },
            {
              field: 'name',
              value: '%er%',
              operator: 'iLike',
            },
          ],
        },
        order: {
          field: 'name',
          order: 'ASC',
        },
        pagination: {
          first: 25,
        },
        assocPagination: {
          first: 1,
        },
        continent_id: 'continent_1',
        assocSearch: {
          field: 'continent_id',
          value: 'continent_1',
          operator: 'eq',
        },
      });
      expect(response?.statusCode).to.eq(200);
    });
  });
});

export {};
