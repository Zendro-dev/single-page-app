import { gql } from 'graphql-request';

describe('Model page', () => {
  before('Login and seed database', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('Logout and reset database', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  beforeEach('Intercept requests and navigate to the model page', () => {
    cy.intercept('http://localhost:3000/meta_query', (req) => {
      if ((req.body.query as string).includes('readAliens')) {
        req.alias = 'read-table-records';
      } else if ((req.body.query as string).includes('countAliens')) {
        req.alias = 'count-table-records';
      }
    });

    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('deleteAlien')) {
        req.alias = 'delete-table-record';
      }
    });

    // Navigate to the alien model page
    cy.visit('/models/alien');

    // Wait and verify the read request and response
    cy.wait('@read-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Can order (sort) the table', () => {
    /* ASCENDING */

    cy.dataCy('table-column-intField').click();

    // Verify read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.order).to.deep.equal({
        field: 'intField',
        order: 'ASC',
      });
      expect(response?.statusCode).to.eq(200);
    });

    /* DESCENDING */

    cy.dataCy('table-column-intField').click();

    // Verify read request and response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.order).to.deep.equal({
        field: 'intField',
        order: 'DESC',
      });
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Can paginate the table', () => {
    /* LIMIT ROW COUNT */

    // Set the row count limit to 5
    cy.dataCy('pagination-select').click();
    cy.dataCy('pagination-select-5').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    /* PAGE FORWARD */

    // Next page
    cy.dataCy('pagination-next').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
        after:
          'eyJpZEZpZWxkIjoiYWxpZW5fMyIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjMsImZsb2F0RmllbGQiOjMuNywiZGF0ZXRpbWVGaWVsZCI6bnVsbCwiYm9vbGVhbkZpZWxkIjp0cnVlLCJzdHJpbmdBcnJheUZpZWxkIjpbXSwiaW50QXJyYXlGaWVsZCI6W10sImZsb2F0QXJyYXlGaWVsZCI6W10sImRhdGV0aW1lQXJyYXlGaWVsZCI6W10sImJvb2xlYW5BcnJheUZpZWxkIjpbXX0=',
      });
      expect(response?.statusCode).to.eq(200);
      // expect(response?.body.data.records).to.have.length(5);
    });

    cy.wait(1000);

    // Next page
    cy.dataCy('pagination-next').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
        after:
          'eyJpZEZpZWxkIjoiYWxpZW5fOCIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjgsImZsb2F0RmllbGQiOjEyNS40OCwiZGF0ZXRpbWVGaWVsZCI6bnVsbCwiYm9vbGVhbkZpZWxkIjp0cnVlLCJzdHJpbmdBcnJheUZpZWxkIjpbXSwiaW50QXJyYXlGaWVsZCI6W10sImZsb2F0QXJyYXlGaWVsZCI6W10sImRhdGV0aW1lQXJyYXlGaWVsZCI6W10sImJvb2xlYW5BcnJheUZpZWxkIjpbXX0=',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(1); // Only the last record (#11) should be shown
    });

    cy.wait(1000);

    /* PAGE BACKWARD */

    // Previous page
    cy.dataCy('pagination-previous').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        last: 5,
        before:
          'eyJpZEZpZWxkIjoiYWxpZW5fOSIsInN0cmluZ0ZpZWxkIjoiU3RyaW5nIiwiaW50RmllbGQiOjksImZsb2F0RmllbGQiOjIuNDIsImRhdGV0aW1lRmllbGQiOm51bGwsImJvb2xlYW5GaWVsZCI6dHJ1ZSwic3RyaW5nQXJyYXlGaWVsZCI6W10sImludEFycmF5RmllbGQiOltdLCJmbG9hdEFycmF5RmllbGQiOltdLCJkYXRldGltZUFycmF5RmllbGQiOltdLCJib29sZWFuQXJyYXlGaWVsZCI6W119',
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    cy.wait(1000);

    /* LAST PAGE */

    cy.dataCy('pagination-last').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        last: 5,
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });

    cy.wait(1000);

    /* FIRST PAGE */

    cy.dataCy('pagination-first').click();

    // Verify the read request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.pagination).to.deep.equal({
        first: 5,
      });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(5);
    });
  });

  it('Can search the table', () => {
    /* SEARCH FIELDS */

    cy.dataCy('model-table-search-field').type('true');
    cy.dataCy('model-table-search-button').click();

    // Verify readAll request and success response
    cy.wait('@read-table-records').then(({ request, response }) => {
      expect(request.body.variables.search).to.deep.equal({
        operator: 'or',
        search: [
          {
            field: 'idField',
            value: '%true%',
            operator: 'iLike',
          },
          {
            field: 'stringField',
            value: '%true%',
            operator: 'iLike',
          },
          {
            field: 'booleanField',
            value: 'true',
            operator: 'eq',
          },
        ],
      });
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.eq(7);
    });

    /* RESET SEARCH */
    // ! Must wait, otherwise this fails sometimes.. See
    // ! https://github.com/cypress-io/cypress/issues/2227
    // ! https://github.com/cypress-io/cypress/issues/3427
    cy.wait(2000);
    cy.dataCy('model-table-search-reset').click();

    // cy.dataCy('model-table-search-field').should('have.value', '');

    // Verify read request and success response
    cy.wait('@read-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
  });

  it('Can navigate to details and edit, reload and delete records', () => {
    /* SETUP */
    cy.gqlRequest(gql`
      mutation {
        addAlien(idField: "alien_to_delete") {
          idField
        }
      }
    `);

    /* RELOAD RECORDS */

    cy.dataCy('model-table-reload').click();

    cy.wait('@read-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    cy.wait('@count-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    /* DELETE RECORD */

    // Cancel confirmation dialog
    cy.dataCy('model-table-delete-alien_to_delete').click();
    cy.dataCy('dialog-cancel').click();

    // Accept confirmation dialog
    cy.dataCy('model-table-delete-alien_to_delete').click();
    cy.dataCy('dialog-ok').click();

    // Verify the delete mutation request and success response
    cy.wait('@delete-table-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        deleteAlien: 'Item successfully deleted',
      });
    });

    // Verify the revalidate request and success response
    cy.wait('@read-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.records).to.have.length(11);
    });

    cy.wait('@count-table-records').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data.count).to.equal(11);
    });

    /* NAVIGATE TO DETAILS */
    cy.dataCy('model-table-view-alien_1').click();
    cy.url().should('include', '/models/alien/details?id=alien_1');

    /* NAVIGATE TO EDIT */
    cy.visit('models/alien');
    cy.dataCy('model-table-edit-alien_1').click();
    cy.url().should('include', '/models/alien/edit?id=alien_1');

    /* NAVIGATE TO NEW */
    cy.visit('models/alien');
    cy.dataCy('model-table-add').click();
    cy.url().should('include', '/models/alien/new');
  });
});

export {};
