// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', () => {
  // cy.intercept('http://localhost:3000/login').as('login');
  cy.visit('/');
  cy.dataCy('login-button').click({ force: true });
  // fill out the inputs and click the button
  cy.dataCy('login-form-email').type('admin@zen.dro');
  cy.dataCy('login-form-password').type('admin');
  cy.dataCy('login-form-login').click();
  cy.wait(1000);
});

Cypress.LocalStorage.clear = function () {
  console.log('--Running LocalStorage.clear--');
  return;
};

Cypress.Commands.add('gqlRequest', (query) => {
  cy.request({
    url: 'http://localhost:3000/login',
    body: { email: 'admin@zen.dro', password: 'admin' },
    method: 'POST',
  }).then((response) => {
    cy.request({
      url: 'http://localhost:3000/graphql',
      headers: {
        authorization: 'Bearer ' + response.body.token,
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: { query },
      method: 'POST',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

Cypress.Commands.add('seedDefaultDb', () => {
  const mutation = `mutation{
    n0:addAlien(idField:"alien_1" stringField:"String" intField:1 floatField:2.4 booleanField:true){idField}
    n1:addAlien(idField:"alien_2" stringField:"String" intField:2 floatField:2.5 booleanField:false){idField}
    n2:addAlien(idField:"alien_3" stringField:"String" intField:3 floatField:3.7 booleanField:true){idField}
    n3:addAlien(idField:"alien_4" stringField:"String" intField:4 floatField:2.8 booleanField:true){idField}
    n4:addAlien(idField:"alien_5" stringField:"String" intField:5 floatField:1.4 booleanField:false){idField}
    n5:addAlien(idField:"alien_6" stringField:"String" intField:6 floatField:12.6 booleanField:true){idField}
    n6:addAlien(idField:"alien_7" stringField:"String" intField:7 floatField:22.34 booleanField:false){idField}
    n7:addAlien(idField:"alien_8" stringField:"String" intField:8 floatField:125.48 booleanField:true){idField}
    n8:addAlien(idField:"alien_9" stringField:"String" intField:9 floatField:2.42 booleanField:true){idField}
    n9:addAlien(idField:"alien_10" stringField:"String" intField:10 floatField:26.42 booleanField:false){idField}
    n10:addAlien(idField:"alien_11" stringField:"String" intField:11 floatField:12.4 booleanField:true){idField}
    c1: addCapital(capital_id:"capital_1",name:"berlin") {capital_id}
    c2: addCapital(capital_id:"capital_2",name:"madrid") {capital_id}
    c3: addCapital(capital_id:"capital_3",name:"mexico city") {capital_id}
    c4: addCapital(capital_id:"capital_4",name:"beijing") {capital_id}
    c11: addCapital(capital_id:"capital_5",name:"amsterdam"){capital_id}
    c12: addCapital(capital_id:"capital_6",name:"paris"){capital_id}
    c5: addContinent(continent_id:"continent_1", name:"Europe"){continent_id}
    c7: addContinent(continent_id:"continent_2", name:"America"){continent_id}
    c8: addContinent(continent_id:"continent_3", name:"Asia"){continent_id}
    r1: addRiver(river_id:"river_1",name:"rhine",length:1000){river_id}
    r2: addRiver(river_id:"river_2",name:"danub",length:2000){river_id}
    r3: addRiver(river_id:"river_3",name:"guadalquivir", length:12000){river_id}
    co1: addCountry(country_id:"country_1",name:"germany",addUnique_capital:"capital_1",addContinent:"continent_1",addRivers:["river_1","river_2"]){country_id}
    co2: addCountry(country_id:"country_2",name:"spain",addUnique_capital:"capital_2",addContinent:"continent_1", addRivers:["river_3"]){country_id}
    co3: addCountry(country_id:"country_3",name:"mexico",addUnique_capital:"capital_3",addContinent:"continent_2"){country_id}
    co4: addCountry(country_id:"country_4",name:"china",addUnique_capital:"capital_4",addContinent:"continent_3"){country_id}
    co5: addCountry(country_id:"country_5",name:"netherlands",addUnique_capital:"capital_5",addContinent:"continent_1",addRivers:["river_1"]){country_id}
    co6: addCountry(country_id:"country_6",name:"france",addUnique_capital:"capital_6",addContinent:"continent_1", addRivers:["river_1"]){country_id}
  }`;

  cy.gqlRequest(mutation);
});

Cypress.Commands.add('resetDefaultDb', () => {
  const mutation = `mutation{
    n0:deleteAlien(idField:"alien_1")
    n1:deleteAlien(idField:"alien_2")
    n2:deleteAlien(idField:"alien_3")
    n3:deleteAlien(idField:"alien_4")
    n4:deleteAlien(idField:"alien_5")
    n5:deleteAlien(idField:"alien_6")
    n6:deleteAlien(idField:"alien_7")
    n7:deleteAlien(idField:"alien_8")
    n8:deleteAlien(idField:"alien_9")
    n9:deleteAlien(idField:"alien_10")
    n10:deleteAlien(idField:"alien_11")
    
    co1: updateCountry(country_id:"country_1",removeUnique_capital:"capital_1",removeContinent:"continent_1",removeRivers:["river_1","river_2"]){country_id}
    co2: updateCountry(country_id:"country_2",removeUnique_capital:"capital_2",removeContinent:"continent_1", removeRivers:["river_3"]){country_id}
    co3: updateCountry(country_id:"country_3",removeUnique_capital:"capital_3",removeContinent:"continent_2"){country_id}
    co4: updateCountry(country_id:"country_4",removeUnique_capital:"capital_4",removeContinent:"continent_3"){country_id}
    co5: updateCountry(country_id:"country_5",removeUnique_capital:"capital_5",removeContinent:"continent_1",removeRivers:["river_1"]){country_id}
    co6: updateCountry(country_id:"country_6",removeUnique_capital:"capital_6",removeContinent:"continent_1", removeRivers:["river_1"]){country_id}
    
    c1: deleteCapital(capital_id:"capital_1")
    c2: deleteCapital(capital_id:"capital_2")
    c3: deleteCapital(capital_id:"capital_3")
    c4: deleteCapital(capital_id:"capital_4") 
    c5: deleteCapital(capital_id:"capital_5")
    ca1: deleteCapital(capital_id:"capital_6")
    ca2: deleteContinent(continent_id:"continent_1")
    ca3: deleteContinent(continent_id:"continent_2")
    ca4: deleteContinent(continent_id:"continent_3")
    r1: deleteRiver(river_id:"river_1")
    r2: deleteRiver(river_id:"river_2")
    r3: deleteRiver(river_id:"river_3")
    co7: deleteCountry(country_id:"country_1")
    co8: deleteCountry(country_id:"country_2")
    co9: deleteCountry(country_id:"country_3")
    co10: deleteCountry(country_id:"country_4")
    co11: deleteCountry(country_id:"country_5")
    co12: deleteCountry(country_id:"country_6")
  }`;

  cy.gqlRequest(mutation);
});

export {};
