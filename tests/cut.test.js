
import {Cut, isWithinCut} from '../src/cut.js';
import {Point} from '../src/lib/point.js';
import {getEllipseArea} from '../src/lib/math.js';
import {CanvasManager, InitializeCanvasManager} from '../src/canvasManager.js';

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


export function createCut(pos, rad){
	let ret = new Cut(pos);
	ret.rad_x = rad;
	ret.rad_y = rad;
	ret.area = getEllipseArea(ret.rad_x,ret.rad_y);

	return ret;
}


describe('Create Cut', () => {
  	it.skip('Should Nest Cuts', () => {
  		let c = createCut(new Point(0,0), 5000);

  		let CM = CanvasManager;
		let c2 = createCut(new Point(0,0), 10)

  		CM.addCut(c);
  		CM.addCut(c2);
  		CM.recalculateCuts();

  		expect(isWithinCut(c,c2)).toBe(true);
  		expect(c.area > c2.area).toStrictEqual(true);
  		expect(c.child_cuts.length).toBe(1);

  	});

  	it('Should set cut levels', () => {
  		let c = createCut(new Point(0,0), 200);
  		let CM = CanvasManager;
  		CM.addCut(c);
  		
  		expect(c.level).toBe(0);
  		expect(c.isEvenLevel()).toBe(true);

  		let c2 = createCut(new Point(0,0), 10);
  		CM.addCut(c2);
  		CM.recalculateCuts();

  		expect(c2.level).toBe(1);
  		expect(c2.isEvenLevel()).toBe(false);  
  	});
});

