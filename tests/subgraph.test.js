
import {Subgraph} from '../src/subgraph.js';
import {Cut} from '../src/cut.js';
import {Point} from '../src/lib/point.js'
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

describe('Subgraph Test', () => {
	jest.spyOn(window, 'alert').mockImplementation(() => {});

	it('empty graph', () =>{
		let s = new Subgraph([], null);
	});


	it('cut as a graph', () => {
		let c = new Cut(new Point(0,0));
		let s = new Subgraph([c], c);

		expect(s.elements.length).toBe(1);
		expect(s.levels[1].length).toBe(1);
		expect( (s.levels[1][0] === c) ).toBeTruthy();
		expect(s.getArea()).toBe(c.area);
	});

});