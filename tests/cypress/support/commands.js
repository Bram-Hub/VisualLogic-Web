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


/**
 * Create a new cut
 * @param {Array} position - x and y position of cut in a list
 * @param {Number} radiusof cut
 * @param {Canvas='#canvas'} tgt canvas id to use
 */ 
Cypress.Commands.add('addCut', (position, radius, canvas='#canvas') => {
    cy.get(canvas)
        .trigger('keydown', {'code' : 'ShiftLeft'})
        .trigger('mousedown', {'offsetX' : position[0], 'offsetY' : position[1]})
        .trigger('mousemove', {'offsetX' : position[0] + (radius/2), 'offsetY' : position[1] + (radius/2)})   
        .trigger('mouseup',  {'offsetX' : position[0] + (radius/2), 'offsetY' : position[1] + (radius/2)})
        .trigger('keyup', {'code' : 'ShiftLeft'});

    cy.get(canvas).click();
});


/**
 * Create a new symbol
 * @param {String} char - symbol to create
 * @param {Canvas='#canvas'} tgt canvas id to use
 */ 
Cypress.Commands.add('addSymbol', (char, canvas='#canvas') => {
    cy.get(canvas)
      .click()
      .trigger('keyup', {'code' : 'key' + char, 'keyCode' : char.charCodeAt(0)});
});


/**
 * Simulate moving the mouse to a given location
 * @param {Array} position - x and y position of cut in a list
 * @param {Canvas='#canvas'} tgt canvas id to use
 */
Cypress.Commands.add('mouseMove', (position, canvas='#canvas') => {
    cy.get(canvas)
      .click()
      .trigger('mousemove', {'offsetX' : position[0], 'offsetY' : position[1]})
      .trigger('mousemove', {'offsetX' : position[0], 'offsetY' : position[1]});
});

/**
 * Simulate a shift + click
 * @param {Canvas='#canvas'} tgt canvas id to use
 */
Cypress.Commands.add('shiftClick', (canvas='#canvas') => {
    cy.get(canvas)
      .trigger('keydown', {'code' : 'ShiftLeft', 'keyCode' : 16, 'force' : true})
      .trigger('mousedown')
      .trigger('mouseup');
});




