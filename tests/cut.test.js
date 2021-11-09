
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


describe('Create Cut', () => {
	it('Add Cut', () => {
  		let c = new Cut( new Point(0,0) );
  	});

  	it('Nest Cuts', () => {
  		let c = new Cut( new Point(0,0) );
  		c.rad_x = 5000;
  		c.rad_y = 5000;
  		//manually update area for now
  		c.area = getEllipseArea(c.rad_x, c.rad_y);

  		let CM = CanvasManager;
		let c2 = new Cut( new Point(0,0) );

  		CM.addCut(c);
  		CM.addCut(c2);
  		CM.recalculateCuts();

  		expect(isWithinCut(c,c2)).toBe(true);
  		expect(c.area > c2.area).toStrictEqual(true);
  		expect(c.child_cuts.length).toBe(1);

  	});
});