
import {Cut, isWithinCut} from '../src/cut.js';
import {Point} from '../src/lib/point.js';
import {isRectInRect} from '../src/lib/math.js';
import {CanvasManager} from '../src/canvasManager.js';
import {initMockApp, deinitMockApp} from './testUtil.js';


beforeEach(() => {
	initMockApp();
});


afterEach(() => {
	deinitMockApp();
});


export function createCut(pos, rad){
	let ret = new Cut(pos);
	ret.rad_x = rad;
	ret.rad_y = rad;

	return ret;
}


describe('Cut tests', () => {
	it('Should build a cut' , () => {
		let c = createCut(new Point(300,500), 200);
		expect(c.center()).toStrictEqual(new Point(300,500));

		c.update();
		expect(c.toString()).toBe("1");
	});

  	it('Should Nest Cuts', () => {
  		let c = createCut(new Point(0,0), 5000);

  		let CM = CanvasManager;
		let c2 = createCut(new Point(0,0), 10)

		c.update();
		c2.update();

  		CM.addCut(c);
  		CM.addCut(c2);
  		CM.recalculateCuts();

  		expect(isWithinCut(c,c2)).toBe(true);
  		expect(c.area > c2.area).toStrictEqual(true);
  		expect(c.child_cuts.length).toBe(1);

		c2.updatePos(new Point(7000,7000));
		c2.update();
		CM.recalculateCuts();

		expect(isRectInRect(c,c2)).toBe(false);
  		expect(c.child_cuts.length).toBe(0);

  	});

  	it('Should set cut levels', () => {
  		let c = createCut(new Point(0,0), 200);
		c.update();
  		let CM = CanvasManager;
  		CM.addCut(c);
  		
  		expect(c.level).toBe(0);
  		expect(c.isEvenLevel()).toBe(true);

  		let c2 = createCut(new Point(0,0), 10);
		c2.update();
  		CM.addCut(c2);
  		CM.recalculateCuts();

  		expect(c2.level).toBe(1);
  		expect(c2.isEvenLevel()).toBe(false);  
  	});
});

