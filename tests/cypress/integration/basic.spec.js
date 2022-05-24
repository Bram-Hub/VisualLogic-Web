
import {getState} from '../support/index.js';

describe('Basic tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
    });

    afterEach(() => {
        //cy.clearLocalStorage();
        //cy.reload();
    });

    it.only ('should create symbol', () => {
        cy.addSymbol('A');

        console.log(window.localStorage.getItem('proof_mode'));
        console.log(window.localStorage.getItem('save-state'));
        console.log(window.localStorage)
        cy.wait(50);
    });

    it('should create a cut', () => {
        cy.addCut([250,250], 250);
    });
});
