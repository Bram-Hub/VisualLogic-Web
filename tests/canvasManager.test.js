import {Cut} from '../src/cut.js';
import {Symbolic} from '../src/symbol.js';
import {Point} from '../src/lib/point.js';
import {CanvasManager, saveState, loadState} from '../src/canvasManager.js';

beforeEach(() => {
	let mck = {
		getContext : function() {},
		addEventListener : function() {}
	}

	CanvasManager.init(mck,mck);
});


afterEach(() => {
	CanvasManager.clear();
});


describe('Save tests', () => {
	it('Save cut', () => {

		let c = new Cut(new Point(0,0));
		CanvasManager.getInstance().addCut(c);

		let d = saveState("string");
		let r = loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});

	it('Save symbolic', () => {

		let s = new Symbolic("A", new Point(0,0) );
		
		CanvasManager.getInstance().addSymbol(s);

		let d = saveState("string");
		let r = loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(s[x]);
		}

	});

	it('Save nested cut', () => {

		let c = new Cut(new Point(0,0));
		let c_1 = new Cut(new Point(0,0));
		CanvasManager.getInstance().addCut(c);
		CanvasManager.getInstance().addCut(c_1);

		c.child_cuts.push(c_1);

		let d = saveState("string");
		let r = loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});


  	it('Save nested cut with symbol', () => {

		let c = new Cut(new Point(0,0));
		let s = new Cut(new Point(0,0));
		CanvasManager.getInstance().addCut(c);
		CanvasManager.getInstance().addCut(s);

		c.child_syms.push(s);

		let d = saveState("string");
		let r = loadState("string", d);

		for(let x in r[0]){
			expect(r[0][x]).toStrictEqual(c[x]);
		}

  	});

});