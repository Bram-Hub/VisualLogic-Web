import {Cut} from '../src/cut.js';
import {Symbolic} from '../src/symbol.js';
import {Point} from '../src/lib/point.js';
import {CanvasManager} from '../src/canvasManager.js';
import {initMockApp, deinitMockApp} from './testUtil.js';


beforeEach(() => {
	initMockApp();
});


afterEach(() => {
	deinitMockApp();
});


describe('Save tests', () => {
	jest.spyOn(window, 'alert').mockImplementation(() => {});

	it('Save cut', () => {

		let c = new Cut(new Point(0,0));
		CanvasManager.addCut(c);

		let d = CanvasManager.save("string");
		let r = CanvasManager.loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});

	it('Save symbolic', () => {

		let s = new Symbolic("A", new Point(0,0) );
		
		CanvasManager.addSymbol(s);

		let d = CanvasManager.save("string");
		let r = CanvasManager.loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(s[x]);
		}

	});

	it('Save nested cut', () => {

		let c = new Cut(new Point(0,0));
		let c_1 = new Cut(new Point(0,0));
		CanvasManager.addCut(c);
		CanvasManager.addCut(c_1);

		c.child_cuts.push(c_1);

		let d = CanvasManager.save("string");
		let r = CanvasManager.loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});


  	it('Save nested cut with symbol', () => {

		let c = new Cut(new Point(0,0));
		let s = new Cut(new Point(0,0));
		CanvasManager.addCut(c);
		CanvasManager.addCut(s);

		c.child_syms.push(s);

		let d = CanvasManager.save("string");
		let r = CanvasManager.loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});

});