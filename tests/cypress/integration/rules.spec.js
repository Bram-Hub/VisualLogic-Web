import {insertion} from '../../../src/logic/rules.js'

describe('Testing logical rules', () => {
    beforeEach(() => {
        cy.visit('/');
    });


    it('should perform insertion', () => {
        cy.addCut([150,150], 1000);
        cy.addCut([250,250], 500);
        cy.wait(10);

        cy.get('#toggle_mode').click();
        cy.mouseMove([250,250]);
        cy.shiftClick();
        cy.get('#insert-btn').click();

        cy.addSymbol('A', '#mini-canvas');
        cy.addSymbol('B', '#mini-canvas');
        cy.get('#insert-graph').click();
    }); 
});
