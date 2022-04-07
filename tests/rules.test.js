import {createCut} from './cut.test';
import {doubleCut, erasure} from '../src/logic/rules.js';
import {initMockApp, deinitMockApp} from './testUtil.js';
import { Point } from '../src/lib/point';
import { CanvasManager } from '../src/canvasManager.js';


beforeEach(() => {
	initMockApp();
});


afterEach(() => {
	deinitMockApp();
});


describe('Logic Rules tests', () => {
    describe('Double cut tests' , () => {
        it('Should double cut', () => {
            const CM = CanvasManager;
            let c1 = createCut(new Point(0,0), 1000);
            let c2 = createCut(new Point(0,0), 100);
            CM.addCut(c1);
            CM.addCut(c2);
            c1.update();
            c2.update();
            CM.recalculateCuts();

            doubleCut([c1,c2]);
        });

    });


    describe('Erasure tests', () => {
        it('Should perform erasure', () => {
            const CM = CanvasManager;

            let c1 = createCut(new Point(0,0), 1000);
            CM.addCut(c1);
            c1.update();
            CM.recalculateCuts();

            erasure([c1]);
        });
    });
});