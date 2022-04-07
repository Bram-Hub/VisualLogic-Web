
import {Symbolic} from '../src/symbol.js';
import {Point} from '../src/lib/point.js';
import {CanvasManager} from '../src/canvasManager.js';
import {createCut} from './cut.test.js';
import {initMockApp, deinitMockApp} from './testUtil.js';


beforeEach(() => {
	initMockApp();
});


afterEach(() => {
	deinitMockApp();
});



describe('Create Symbol', () => {
	it('Should create symbols', () => {
		let s = new Symbolic('A', new Point(0,0));

		s.updatePos(new Point(10,10));
		s.update();

		expect(s.x).toBe(10);
		expect(s.y).toBe(10);

		expect(s.toString()).toBe("1");
	});

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

