import { AuthToken } from '@/types/auth';
import decode from 'jwt-decode';

describe('Record edit', () => {
  before('login', () => {
    cy.login();
    cy.get('@token').then((token) => {
      // console.log(token.toS); // #b
      // cy.addDummyAlien(token);
    });
    // console.log({ token });
  });

  after('logout', () => {
    cy.dataCy('login-button').click({ force: true });
  });

  it('Cancel Form', () => {
    cy.visit('/models/country/edit?id=country_1');

    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/country');
  });

  it('Non-existing record', () => {
    cy.intercept('http://localhost:3000/graphql').as('read');
    cy.visit('/models/country/edit?id=this-country-does-not-exist');
    cy.wait('@read').then(({ response }) => {
      console.log({ response });
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

  it('record alien_1 edit page', () => {
    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('read')) {
        req.alias = 'read-record';
      } else if ((req.body.query as string).includes('mutation')) {
        req.alias = 'update-record';
      }
    });

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
      console.log({ request, response });

      expect(request.body.variables).to.deep.eq({
        idField: 'alien_test_update',
        stringField: 'Zartaxl',
        intField: 9,
        floatField: 6.66,
        datetimeField: '2021-06-01T06:43:30.000Z',
        booleanField: false,
        stringArrayField: ['my_first_string', 'second_string_revised'],
        intArrayField: null,
        floatArrayField: null,
        datetimeArrayField: null,
        booleanArrayField: null,
      });
      expect(response?.body.data).to.deep.eq({
        updateAlien: {
          idField: 'alien_test_update',
          stringField: 'Zartaxl',
          intField: 9,
          floatField: 6.66,
          datetimeField: '2021-06-01T06:43:30.000Z',
          booleanField: false,
          stringArrayField: ['my_first_string', 'second_string_revised'],
          intArrayField: null,
          floatArrayField: null,
          datetimeArrayField: null,
          booleanArrayField: null,
        },
      });
    });
    cy.url().should('include', '/models/alien');
    cy.pause();
  });

  it.only('record alien_1 edit page, actions', () => {
    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('read')) {
        req.alias = 'read-record';
      } else if ((req.body.query as string).includes('mutation')) {
        req.alias = 'update-record';
      }
    });

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

    /* DELETE */

    cy.pause();
  });
});

export {};
