
import {Point} from '../src/lib/point.js';
import {getDistance} from '../src/lib/math.js';

describe('Point tests', () => {
    it('init point', () => {
    	let p1 = new Point(0,0);
        expect(p1.x).toBe(0);
        expect(p1.y).toBe(0);

        let p2 = new Point(0,0);
        expect(p1).toStrictEqual(p2);
    });

    it('distance test', () => {
        let p1 = new Point(0,0);
        let p2 = new Point(0,1);
        let p4 = new Point(1,1);

        expect(getDistance(p1,p2)).toBe(1);
        expect(getDistance(p1,p1)).toBe(0);
        expect(getDistance(p2,p4)).toBe(1);
        expect(getDistance(p2,p1)).toBe(1);
    });

    it('update test', () => {
        
    });
});


describe('Point direction tests', () =>{
    it('left/Right', () => {
        let p1 = new Point(0,0);
        let p2 = new Point(-1,0);

        expect(p2.leftOf(p1)).toBeTruthy();
        expect(p1.rightOf(p2)).toBeTruthy();
    });

    it('top/down', () => {
        //in canvas coords 0 is at the top
        let p1 = new Point(0,1);
        let p2 = new Point(0,0);

        expect(p1.below(p2)).toBeTruthy();
        expect(p2.above(p1)).toBeTruthy();
    })

    it('same', () => {
        let p1 = new Point(0,0);
        expect(p1.above(p1)).toBeFalsy();
        expect(p1.below(p1)).toBeFalsy();
        expect(p1.leftOf(p1)).toBeFalsy();
        expect(p1.rightOf(p1)).toBeFalsy();
    })
});