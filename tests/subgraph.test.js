
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
		let s = new Subgraph([]);
	});

});