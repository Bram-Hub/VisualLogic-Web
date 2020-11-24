
import {Vector, drawVector} from '../src/lib/vector.js';
import {Point} from '../src/lib/point.js';

describe('Vector tests', () => {
	it('create vector', () => {
		let v = new Vector(
			new Point(0,0), new Point(0,1)
		);

		expect(v.r).toBe(1);
		expect(v.left_to_right).toBe(true);
		expect(v.angle_degrees).toBe(90);
	});
});
