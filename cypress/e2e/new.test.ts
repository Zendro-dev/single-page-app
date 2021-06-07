describe('new record', () => {
  before('login and Db seed', () => {
    cy.seedDefaultDb();
    cy.login();
  });

  after('logout and Db reset', () => {
    cy.resetDefaultDb();
    cy.dataCy('login-button').click({ force: true });
  });

  it('Cancel Form', () => {
    cy.visit('/models/alien/new');
    cy.dataCy('record-form-exit').click();
    cy.url().should('include', '/models/alien');
  });

  it('Submit new alien', () => {
    cy.intercept('http://localhost:3000/graphql').as('add');

    cy.intercept('http://localhost:3000/graphql', (req) => {
      if ((req.body.query as string).includes('addAlien')) {
        req.alias = 'add-record';
      } else if ((req.body.query as string).includes('deleteAlien')) {
        req.alias = 'delete-record';
      }
    });

    cy.visit('/models/alien/new');

    // type in attributes
    cy.dataCy('record-form-fields-idField').type('alien_test_1');
    cy.dataCy('record-form-fields-stringField').type('Xortacl');
    cy.dataCy('record-form-fields-intField').type('5');
    cy.dataCy('record-form-fields-floatField').type('2.45');
    // cy.dataCy('record-form-fields-booleanField').click().click();
    cy.get('input[type="checkbox"]').click().click();
    // Datetime field
    cy.dataCy('record-form-fields-datetimeField').click();
    cy.get(
      'button[aria-label="calendar view is open, go to text input view"]'
    ).click();
    cy.get('div[class="MuiPickersMobileKeyboardInputView-root"]').within(() => {
      cy.dataCy('record-form-fields-datetimeField').type(
        '2021-05-01T08:43:30.000Z'
      );
    });
    cy.get('span').contains('OK').click();
    // Arrayfield
    cy.get('div').contains('stringArrayField').click();
    cy.get('span').contains('Add New Item').click();
    cy.dataCy('arrayfield-inputfield-0').type('my_first_string');
    cy.dataCy('arrayfield-add-item-0').click({ force: true });
    cy.dataCy('arrayfield-inputfield-1').type('my_second_string');
    cy.dataCy('arrayfield-add-item-1').click({ force: true });
    cy.dataCy('arrayfield-inputfield-2').type('my_real_second_string');
    cy.dataCy('arrayfield-delete-item-1').click();

    // submit mutation
    cy.dataCy('record-form-submit').click({ force: true });
    // confirm submition
    cy.dataCy('dialog-ok').click({ force: true });

    cy.wait('@add-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.equal({
        idField: 'alien_test_1',
        stringField: 'Xortacl',
        intField: 5,
        floatField: 2.45,
        datetimeField: '2021-05-01T06:43:30.000Z',
        booleanField: true,
        stringArrayField: ['my_first_string', 'my_real_second_string'],
        intArrayField: null,
        floatArrayField: null,
        datetimeArrayField: null,
        booleanArrayField: null,
      });
      expect(response?.statusCode).to.eq(200);
    });

    cy.url().should('include', '/models/alien/edit?id=alien_test_1');

    /* Delete the record to clean up */
    cy.dataCy('record-form-delete').click();
    cy.dataCy('dialog-ok').click();
    cy.wait('@delete-record').then(({ response }) => {
      console.log({ response });
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.data).to.deep.eq({
        deleteAlien: 'Item successfully deleted',
      });
    });
  });

  it('Submition Errors', () => {
    cy.intercept('http://localhost:3000/graphql').as('add-record');
    cy.visit('/models/country/new');

    /* Existing Record */
    // type in attributes
    cy.dataCy('record-form-fields-country_id').type('country_1');
    cy.dataCy('record-form-fields-name').type('USA');

    //submit mutation
    cy.dataCy('record-form-submit').click();

    cy.wait('@add-record').then(({ request, response }) => {
      expect(request.body.variables).to.deep.equal({
        country_id: 'country_1',
        name: 'USA',
      });
      expect(response?.statusCode).to.eq(500);
    });

    cy.visit('/models/country/new');
    /* Validation Errors */
    // type in attributes
    cy.dataCy('record-form-fields-country_id').type('country_invalid');
    cy.dataCy('record-form-fields-name').type('USA2');

    cy.dataCy('record-form-submit').click();

    cy.wait('@add-record').then(({ response }) => {
      console.log({ response });
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
