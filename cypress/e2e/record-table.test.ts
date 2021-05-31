describe('record-table', () => {
  // but set the user before visiting the page
  // so the app thinks it is already authenticated

  before('login and Db seed', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('logout and Db reset', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  beforeEach('intercept requests', () => {
    cy.intercept('http://localhost:3000/meta_query', (req) => {
      if ((req.body.query as string).includes('readAliens')) {
        req.alias = 'read';
      } else if ((req.body.query as string).includes('countAliens')) {
        req.alias = 'count';
      }
    });
    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('mutation')) {
        req.alias = 'mutation';
      }
    });
    cy.visit('/models/alien');

    // Wait for inital requests
    cy.wait('@read').then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait('@count').then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Alien model table - order', () => {
    /* ORDER */
    // click on intField to order intField ASC
    cy.dataCy('table-column-intField').click();
    cy.wait('@read').then(({ request, response }) => {
      // check request variables
      expect(request.body.variables.order).to.deep.equal({
        field: 'intField',
        order: 'ASC',
      });
      // check response status
      expect(response?.statusCode).to.eq(200);
    });

    // click on inField again to order intField DESC
    cy.dataCy('table-column-intField').click();
    cy.wait('@read').then(({ request, response }) => {
      // check request variables
      expect(request.body.variables.order).to.deep.equal({
        field: 'intField',
        order: 'DESC',
      });
      // check response status
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Alien model table - pagination', () => {
    /* PAGINATION */
    // click on the select and then select 5
    cy.dataCy('pagination-select').click();
    cy.dataCy('pagination-select-5').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    // click on next page
    cy.dataCy('pagination-next').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
        after:
          'eyJpZEZpZWxkIjoiYWxpZW5fMyIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjMsImZsb2F0RmllbGQiOjMuNywiZGF0ZXRpbWVGaWVsZCI6bnVsbCwiYm9vbGVhbkZpZWxkIjp0cnVlLCJzdHJpbmdBcnJheUZpZWxkIjpbXSwiaW50QXJyYXlGaWVsZCI6W10sImZsb2F0QXJyYXlGaWVsZCI6W10sImRhdGV0aW1lQXJyYXlGaWVsZCI6W10sImJvb2xlYW5BcnJheUZpZWxkIjpbXX0=',
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      // expect(response?.body.data.records).to.have.length(5);
    });

    // click on next page again
    cy.wait(1000);
    cy.dataCy('pagination-next').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
        after:
          'eyJpZEZpZWxkIjoiYWxpZW5fOCIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjgsImZsb2F0RmllbGQiOjEyNS40OCwiZGF0ZXRpbWVGaWVsZCI6bnVsbCwiYm9vbGVhbkZpZWxkIjp0cnVlLCJzdHJpbmdBcnJheUZpZWxkIjpbXSwiaW50QXJyYXlGaWVsZCI6W10sImZsb2F0QXJyYXlGaWVsZCI6W10sImRhdGV0aW1lQXJyYXlGaWVsZCI6W10sImJvb2xlYW5BcnJheUZpZWxkIjpbXX0=',
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      // since there are 11 records only the last one should be shown
      expect(response?.body.data.records).to.have.length(1);
    });

    // click on previous page
    cy.dataCy('pagination-previous').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        last: 5,
        before:
          'eyJpZEZpZWxkIjoiYWxpZW5fOSIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjksImZsb2F0RmllbGQiOjIuNDIsImRhdGV0aW1lRmllbGQiOm51bGwsImJvb2xlYW5GaWVsZCI6dHJ1ZSwic3RyaW5nQXJyYXlGaWVsZCI6W10sImludEFycmF5RmllbGQiOltdLCJmbG9hdEFycmF5RmllbGQiOltdLCJkYXRldGltZUFycmF5RmllbGQiOltdLCJib29sZWFuQXJyYXlGaWVsZCI6W119',
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    // click on last page
    cy.dataCy('pagination-last').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        last: 5,
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    // click on first page
    cy.dataCy('pagination-first').click();
    cy.wait('@read').then(({ request, response }) => {
      //check request variables
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });
  });

  it('Alien model table - search', () => {
    /* SEARCH */
    cy.dataCy('model-table-search-field').type('true');
    cy.dataCy('model-table-search-button').click();
    // check request variables for the readAll
    cy.wait('@read').then(({ request, response }) => {
      expect(request.body.variables.search).to.deep.equal({
        operator: 'or',
        search: [
          {
            field: 'idField',
            value: '%true%',
            operator: 'like',
          },
          {
            field: 'stringField',
            value: '%true%',
            operator: 'like',
          },
          {
            field: 'booleanField',
            value: 'true',
            operator: 'eq',
          },
        ],
      });
      // check response status and records
      expect(response?.statusCode).to.eq(200);
    });

    // check if the count is correct
    cy.wait('@count').then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(7);
    });

    // click on reset button
    // ! temporary wait. Otherwise this fails sometimes.. See
    // ! https://github.com/cypress-io/cypress/issues/2227
    // ! https://github.com/cypress-io/cypress/issues/3427
    cy.wait(2000);
    cy.dataCy('model-table-search-reset').click();
    // cy.dataCy('model-table-search-field').should('have.value', '');
    cy.wait('@read').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait('@count').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Alien model table - actions', () => {
    // Add test alien to delete
    const addAlien = `mutation {
      addAlien(idField: "alien_to_delete") {idField}
    }`;
    cy.gqlRequest(addAlien);

    /* RELOAD */
    cy.dataCy('model-table-reload').click();
    cy.wait('@read').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait('@count').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
    });

    /* DELETE */
    // cancel
    cy.dataCy('model-table-delete-alien_to_delete').click();
    cy.dataCy('dialog-cancel').click();
    // Ok
    cy.dataCy('model-table-delete-alien_to_delete').click();
    cy.dataCy('dialog-ok').click();
    cy.wait('@mutation').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        deleteAlien: 'Item successfully deleted',
      });
    });
    cy.wait('@read').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(11);
    });
    cy.wait('@count').then(({ request, response }) => {
      // check response status and records
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.equal(11);
    });

    /* VIEW */
    cy.dataCy('model-table-view-alien_1').click();
    cy.url().should('include', '/models/alien/details?id=alien_1');

    /* EDIT */
    cy.visit('models/alien');
    cy.dataCy('model-table-edit-alien_1').click();
    cy.url().should('include', '/models/alien/edit?id=alien_1');

    /* NEW */
    cy.visit('models/alien');
    cy.dataCy('model-table-add').click();
    cy.url().should('include', '/models/alien/new');
  });
});

export {};
