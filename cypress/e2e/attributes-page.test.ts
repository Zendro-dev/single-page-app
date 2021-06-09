import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { gql } from 'graphql-request';

describe('Record attributes page', () => {
  before('Login and seed database', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('Logout and reset database', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  beforeEach('Add test data and intercept requests', () => {
    cy.gqlRequest(gql`
      mutation {
        addAlien(
          idField: "alien_test_update"
          stringField: "Xortacl"
          intField: 5
          floatField: 2.45
          datetimeField: "2021-05-01T06:43:30.000Z"
          booleanField: true
          stringArrayField: ["my_first_string", "my_real_second_string"]
        ) {
          idField
        }
      }
    `);

    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('readOneAlien')) {
        req.alias = 'read-record-alien';
      } else if ((req.body.query as string).includes('readOneCountry')) {
        req.alias = 'read-record-country';
      } else if ((req.body.query as string).includes('updateAlien')) {
        req.alias = 'update-record';
      } else if ((req.body.query as string).includes('addCountry')) {
        req.alias = 'create-record-country';
      } else if ((req.body.query as string).includes('addAlien')) {
        req.alias = 'create-record-alien';
      } else if ((req.body.query as string).includes('deleteAlien')) {
        req.alias = 'delete-record';
      }
    });
  });

  afterEach('Cleanup test data', () => {
    cy.gqlRequest(gql`
      mutation {
        deleteAlien(idField: "alien_test_update")
      }
    `);
  });

  it('Querying attributes of a non-existing record throws', () => {
    // Navigate to country attributes page
    cy.visit('/models/country/details?id=this-country-does-not-exist');

    // Verify the error response
    cy.wait('@read-record-country').then(({ response }) => {
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

  it('Can fetch and reload attributes, and move between details and edit pages', () => {
    /* FETCH DETAILS ATTRIBUTES */

    // Navigate to country details attributes page
    cy.visit('/models/country/details?id=country_1');

    // Verify request and success response
    cy.wait('@read-record-country').then(({ request, response }) => {
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

    /* RELOAD DETAILS ATTRIBUTES */

    cy.dataCy('record-form-reload').click();

    // Verify request and success response
    cy.wait('@read-record-country').then(({ request, response }) => {
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

    /* FETCH EDIT ATTRIBUTES */

    // Navigate to alien edit attributes page
    cy.dataCy('record-form-update').click();
    cy.url().should('include', '/models/country/edit?id=country_1');

    // Verify request and success response
    cy.wait('@read-record-country').then(({ request, response }) => {
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

    /* RELOAD EDIT ATTRIBUTES */

    cy.dataCy('record-form-reload').click();

    // Verify request and success response
    cy.wait('@read-record-country').then(({ request, response }) => {
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
  });

  it('Can exit / cancel the form', () => {
    cy.visit('/models/country/details?id=country_1');
    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');

    cy.visit('/models/country/edit?id=country_1');
    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');

    cy.visit('/models/country/new');
    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');
  });

  it('Can update attributes', () => {
    // Navigate to alien attributes page
    cy.visit('/models/alien/edit?id=alien_test_update');

    /* FETCH RECORD ATTRIBUTES */

    // Verify the request and success response
    cy.wait('@read-record-alien').then(({ request, response }) => {
      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
      });
      expect(response?.statusCode).to.eq(200);
    });

    /* UPDATE ATTRIBUTES */

    // Set all attribute values to NULL
    cy.dataCy('record-fields-unset').each(($field) => {
      cy.wrap($field).click();
    });

    // Update stringField
    cy.dataCy('record-form-fields-stringField').type('Zartaxl');

    // Update intField
    cy.dataCy('record-form-fields-intField').type('9');

    // Update floatField
    cy.dataCy('record-form-fields-floatField').type('6.66');

    // Update datetimeField
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

    // Update stringArrayField
    cy.get('div').contains('stringArrayField').click();
    cy.dataCy('arrayfield-inputfield-unset-1').click();
    cy.dataCy('arrayfield-inputfield-1').type('second_string_revised');

    // Submit and confirm the mutation
    cy.dataCy('record-form-submit').click();
    cy.dataCy('dialog-ok').click();

    // Verify the mutation request and success response
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

    // Verify that we are redirected to the model page
    cy.url().should('include', '/models/alien');
  });

  it('Can add new and delete existing records', () => {
    // Navigate to alien new page
    cy.visit('/models/alien/new');

    /* ADD NEW RECORD */

    // Set idField
    cy.dataCy('record-form-fields-idField').type('alien_test_create');

    // Set stringField
    cy.dataCy('record-form-fields-stringField').type('Xortacl');

    // Set intField
    cy.dataCy('record-form-fields-intField').type('5');

    // Set floatField
    cy.dataCy('record-form-fields-floatField').type('2.45');

    // Set boolField to true
    cy.get('input[type="checkbox"]').click().click();

    // Set datetimeField
    const date = format(
      new Date('2021-06-08T14:08:27.000Z'),
      'yyyy/MM/dd HH:mm:ss.SSS',
      {
        locale: enGB,
      }
    );
    cy.dataCy('record-form-fields-datetimeField').find('button').click();
    cy.dataCy('record-form-fields-datetimeField').click();
    cy.get(
      'button[aria-label="calendar view is open, go to text input view"]'
    ).click();
    cy.get('div[class="MuiPickersMobileKeyboardInputView-root"]').within(() => {
      cy.dataCy('record-form-fields-datetimeField').type(date);
    });
    cy.get('span').contains('OK').click();

    // Set stringArrayField
    cy.get('div').contains('stringArrayField').click();
    cy.get('span').contains('Add New Item').click();
    cy.dataCy('arrayfield-inputfield-0').type('my_first_string');
    cy.dataCy('arrayfield-add-item-0').click({ force: true });
    cy.dataCy('arrayfield-inputfield-1').type('my_second_string');
    cy.dataCy('arrayfield-add-item-1').click({ force: true });
    cy.dataCy('arrayfield-inputfield-2').type('my_real_second_string');
    cy.dataCy('arrayfield-delete-item-1').click();

    // Submit and confirm mutation
    cy.dataCy('record-form-submit').click({ force: true });
    cy.dataCy('dialog-ok').click({ force: true });

    // Verify the request and success response
    cy.wait('@create-record-alien').then(({ request, response }) => {
      expect(request.body.variables).to.deep.equal({
        idField: 'alien_test_create',
        stringField: 'Xortacl',
        intField: 5,
        floatField: 2.45,
        datetimeField: '2021-06-08T14:08:27.000Z',
        booleanField: null,
        stringArrayField: ['my_first_string', 'my_real_second_string'],
      });
      expect(response?.statusCode).to.eq(200);
    });

    // Verify we are redirected to the edit page
    cy.url().should('include', '/models/alien/edit?id=alien_test_create');

    /* DELETE RECORD */

    cy.dataCy('record-form-delete').click();
    cy.dataCy('dialog-ok').click();

    // Verify the request and success response
    cy.wait('@delete-record').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        deleteAlien: 'Item successfully deleted',
      });
    });
  });

  it('Receive server errors when creating a new record', () => {
    // Navigate to new country page
    cy.visit('/models/country/new');

    /* ID ALREADY EXISTS ERROR */

    // Set country_id and name fields
    cy.dataCy('record-form-fields-country_id').type('country_1');
    cy.dataCy('record-form-fields-name').type('USA');

    // Submit form
    cy.dataCy('record-form-submit').click();

    // Verify mutation request and error response
    cy.wait('@create-record-country').then(({ request, response }) => {
      expect(request.body.variables).to.deep.equal({
        country_id: 'country_1',
        name: 'USA',
      });
      expect(response?.statusCode).to.eq(500);
    });

    /* VALIDATION ERRORS */

    // Navigate to new country page
    cy.visit('/models/country/new');

    // Set country_id and name fields
    cy.dataCy('record-form-fields-country_id').type('country_invalid');
    cy.dataCy('record-form-fields-name').type('USA2');

    // Submit form
    cy.dataCy('record-form-submit').click();

    // Verify mutation request and error response
    cy.wait('@create-record-country').then(({ response }) => {
      expect(response?.body.errors).to.deep.eq([
        {
          message: 'validation failed',
          locations: [
            {
              line: 1,
              column: 55,
            },
          ],
          extensions: {
            validationErrors: [
              {
                keyword: 'pattern',
                dataPath: '.name',
                schemaPath: '#/properties/name/pattern',
                params: {
                  pattern: '^[A-Za-z]+$',
                },
                message: 'should match pattern "^[A-Za-z]+$"',
              },
            ],
          },
          path: ['addCountry'],
        },
      ]);
      expect(response?.statusCode).to.eq(500);
    });
  });
});

export {};
