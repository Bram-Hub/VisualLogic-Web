
import {Symbolic} from '../src/symbol.js';
import {Point} from '../src/lib/point.js';
import {CanvasManager, InitializeCanvasManager} from '../src/canvasManager.js';
import {createCut} from './cut.test.js';

beforeEach(() => {
	let mck = {
		getContext : function() {},
		addEventListener : function() {}
	}

	InitializeCanvasManager(mck,mck);
});


afterEach(() => {
	CanvasManager.clearData();
});



describe('Create Symbol', () => {
  	it('Should set symbol levels', () => {
  		let s = new Symbolic('A', new Point(0,0));

  		expect(s.level).toBe(0);
  		let CM = CanvasManager;
  		CM.addSymbol(s);

  		let c = createCut(new Point(0,0), 200);
  		CM.addCut(c);
  		CM.recalculateCuts();

  		expect(s.level).toBe(1);
  		expect(s.isEvenLevel()).toBe(false);
  	});
});

