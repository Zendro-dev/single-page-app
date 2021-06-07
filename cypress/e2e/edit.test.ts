describe('Record edit', () => {
  before('login and Db seed', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('logout and Db reset', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  beforeEach('intercept requests', () => {
    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('read')) {
        req.alias = 'read-record';
      } else if ((req.body.query as string).includes('mutation')) {
        req.alias = 'update-record';
      }
    });

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

  it('Querying a non-existing record throws', () => {
    cy.visit('/models/country/edit?id=this-country-does-not-exist');
    cy.wait('@read-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.errors).to.deep.eq([
        {
          message:
            'Record with ID = "this-country-does-not-exist" does not exist',
          locations: [
            {
              line: 1,
              column: 42,
            },
          ],
          path: ['readOneCountry'],
        },
      ]);
    });
  });

  it('Attributes form can be cancelled', () => {
    cy.visit('/models/country/edit?id=country_1');

    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');
  });

  it('Attributes form fetches and updates correctly', () => {
    const addDummyAlien = `mutation {
      addAlien(idField: "alien_test_update",
      stringField: "Xortacl",
      intField: 5,
      floatField: 2.45,
      datetimeField: "2021-05-01T06:43:30.000Z",
      booleanField: true,
      stringArrayField: ["my_first_string", "my_real_second_string"]){idField}}`;
    cy.gqlRequest(addDummyAlien);

    cy.visit('/models/alien/edit?id=alien_test_update');

    cy.wait('@read-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });

    /* UPDATE ATTRIBUTES */

    // reset all attributes
    cy.dataCy('record-fields-unset').each(($field) => {
      cy.wrap($field).click();
    });
    // type new values
    cy.dataCy('record-form-fields-stringField').type('Zartaxl');
    cy.dataCy('record-form-fields-intField').type('9');
    cy.dataCy('record-form-fields-floatField').type('6.66');
    // Datetime field
    cy.dataCy('record-form-fields-datetimeField').click();
    cy.get(
      'button[aria-label="calendar view is open, go to text input view"]'
    ).click();
    cy.get('div[class="MuiPickersMobileKeyboardInputView-root"]').within(() => {
      cy.dataCy('record-form-fields-datetimeField').type(
        '2021-06-01T08:43:30.000Z'
      );
    });
    cy.get('span').contains('OK').click();

    // Arrayfield
    cy.get('div').contains('stringArrayField').click();
    cy.dataCy('arrayfield-inputfield-unset-1').click();
    cy.dataCy('arrayfield-inputfield-1').type('second_string_revised');

    // submit mutation
    cy.dataCy('record-form-submit').click();
    // confirm submition
    cy.dataCy('dialog-ok').click();

    // wait for request to the server
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
        stringField: 'Zartaxl',
        intField: 9,
        floatField: 6.66,
        datetimeField: '2021-06-01T06:43:30.000Z',
        booleanField: true,
        stringArrayField: ['my_first_string', 'second_string_revised'],
        intArrayField: [],
        floatArrayField: [],
        datetimeArrayField: [],
        booleanArrayField: [],
      });
      expect(response?.body.data).to.deep.eq({
        updateAlien: {
          idField: 'alien_test_update',
          stringField: 'Zartaxl',
          intField: 9,
          floatField: 6.66,
          datetimeField: '2021-06-01T06:43:30.000Z',
          booleanField: true,
          stringArrayField: ['my_first_string', 'second_string_revised'],
          intArrayField: [],
          floatArrayField: [],
          datetimeArrayField: [],
          booleanArrayField: [],
        },
      });
    });
    cy.url().should('include', '/models/alien');
    const deleteDummyAlien = `mutation{ deleteAlien(idField: "alien_test_update") }`;
    cy.gqlRequest(deleteDummyAlien);
  });

  it('Attributes form actions work correctly', () => {
    const addDummyAlien = `mutation {
      addAlien(idField: "alien_test_update",
      stringField: "Xortacl",
      intField: 5,
      floatField: 2.45,
      datetimeField: "2021-05-01T06:43:30.000Z",
      booleanField: true,
      stringArrayField: ["my_first_string", "my_real_second_string"]){idField}}`;
    cy.gqlRequest(addDummyAlien);
    cy.visit('/models/alien/edit?id=alien_test_update');

    cy.wait('@read-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });

    /* RELOAD */
    cy.dataCy('record-form-reload').click({ force: true });

    cy.wait('@read-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });

    /* Delete the record to clean up */
    cy.dataCy('record-form-delete').click();
    cy.dataCy('dialog-ok').click();
    cy.wait('@update-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        deleteAlien: 'Item successfully deleted',
      });
    });
  });

  it('Associations table fetch, select, and update work correctly', () => {
    // Add test records
    const addRecords = `mutation {
      addCountry(
        country_id: "country_test_update"
        name: "belgium"
      ) { country_id }
      addCapital(
        capital_id: "capital_test_update",
        name: "brussels"
      ) { capital_id }
    }`;
    cy.gqlRequest(addRecords);

    cy.visit('/models/country/edit?id=country_test_update');
    cy.wait('@read-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    // switch to associations tab
    cy.dataCy('record-form-tab-associations').click();

    // check initial request
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

    /* WRITE ASSOCIATIONS */
    // associate test_country to test_capital
    cy.dataCy('associations-table-mark-capital_test_update').click();
    cy.dataCy('associations-table-save').click();
    // check request / response of the mutation
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
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    cy.wait(2000);
    // unassociate test_country to test_capital
    cy.dataCy('associations-table-mark-capital_test_update').click();
    cy.dataCy('associations-table-save').click();
    // check request / response of the mutation
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        removeUnique_capital: 'capital_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    // switch to continent
    cy.dataCy('country-association-select').click();
    cy.dataCy('country-association-select-continent').click();

    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );
    // associate continent_2
    cy.dataCy('associations-table-mark-continent_2').click();
    cy.dataCy('associations-table-save').click();
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addContinent: 'continent_2',
      });
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );
    // ! wait
    cy.wait(2000);
    // reassociate with another continent. Make sure that the old one is removed
    cy.dataCy('associations-table-mark-continent_1').click();
    cy.dataCy('associations-table-save').click();
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addContinent: 'continent_1',
        removeContinent: 'continent_2',
      });
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    // switch to rivers
    cy.dataCy('country-association-select').click();
    cy.dataCy('country-association-select-rivers').click();

    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );
    // associate rivers
    cy.dataCy('associations-table-mark-river_1').click();
    cy.dataCy('associations-table-mark-river_2').click();
    cy.dataCy('associations-table-save').click();
    cy.wait('@update-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        country_id: 'country_test_update',
        addRivers: ['river_1', 'river_2'],
      });
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    // Delete test record
    const deleteCountry = `mutation{
      updateCountry(
        country_id: "country_test_update"
        removeUnique_capital: "capital_test_update"
        removeContinent:"continent_1"
        removeRivers:["river_1","river_2"]
        ) {country_id}
      deleteCountry(country_id: "country_test_update")
      deleteCapital(capital_id: "capital_test_update")
    }`;
    cy.gqlRequest(deleteCountry);
  });

  it('Assocations table correctly applies filters', () => {
    cy.visit('/models/country/edit?id=country_1');

    // intial requests
    cy.wait('@read-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    // switch to associations tab
    cy.dataCy('record-form-tab-associations').click();

    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    /* ASSOCIATION FILTERS */
    /* to-one */
    cy.log('to-one');
    // filter associated records
    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-associated').click();
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
    // reset filters
    cy.wait(2000);
    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-no-filter').click();
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    /* many-to-many foreignKey Array */
    cy.log('many-to-many through foreignKey Array');
    // switch to rivers
    cy.dataCy('country-association-select').click();
    cy.dataCy('country-association-select-rivers').click();
    // initial request
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

    // filter associated records
    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-associated').click();

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

    // mark river_1 for disassociation
    cy.dataCy('associations-table-mark-river_1').click();
    cy.dataCy('associations-table-mark-river_2').click();
    // select records-to-remove filter
    cy.dataCy('country-association-filters').click();
    cy.dataCy('country-association-filters-records-to-remove').click();

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

    // additionally add a search
    cy.dataCy('model-table-search-field').type('rhine');
    cy.dataCy('model-table-search-button').click();

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
                  operator: 'like',
                },
                {
                  field: 'name',
                  value: '%rhine%',
                  operator: 'like',
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

    /* many_to_one */
    cy.log('many-to-one');
    cy.visit('/models/continent/edit?id=continent_1');

    // switch to associations tab
    cy.dataCy('record-form-tab-associations').click();

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
      ]);
    });
    cy.wait('@count-assoc-table').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        continent_id: 'continent_1',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        count: 6,
      });
    });

    // filter associated records
    cy.dataCy('continent-association-filters').click();
    cy.dataCy('continent-association-filters-associated').click();

    cy.wait('@read-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait('@count-assoc-table').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        count: 4,
      });
    });

    // additionally add a search
    cy.dataCy('model-table-search-field').type('er');
    cy.dataCy('model-table-search-button').click();
    cy.wait(['@read-assoc-table', '@count-assoc-table']).then(
      ([read, count]) => {
        expect(read.response?.statusCode).to.eq(200);
        expect(count.response?.statusCode).to.eq(200);
      }
    );

    // additionally sort by country name
    cy.dataCy('table-header-column-name').click();
    cy.wait('@read-assoc-table').then(({ request, response }) => {
      console.log({ request, response });
      expect(request.body.variables).to.deep.eq({
        search: {
          operator: 'or',
          search: [
            {
              field: 'country_id',
              value: '%er%',
              operator: 'like',
            },
            {
              field: 'name',
              value: '%er%',
              operator: 'like',
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
