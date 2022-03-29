import {Point} from './point.js';


/**
* Given a point and a description of an ellipse determine if that point is
* within that ellipse, the coordinates are assumed to represent HTML canvas points
*
* @param {Point} point the point being tested
* @param {Number} x the x position of the ellipse
* @param {Number} y the y position of the ellipse
* @param {Number} rad_x the radius in the x axis
* @param {Number} rad_y the radius in the y axis
* @returns {Boolean}
*/
function isWithinEllipse(point, x, y, rad_x, rad_y){
    // (x-h)^2/a^2 + (y-k)^2/b^2 <= 1

    const a = Math.pow( point.x - x, 2) / Math.pow(rad_x, 2);
    const b = Math.pow( point.y - y, 2) / Math.pow(rad_y, 2);

    return a+b <= 1;
}


/**
 * Given two rects return true if rect b is within a
 * @param {Array} [x,y,width,height]
 * @param {Array} [x,y,width,height]
 */
function isRectInRect(a,b){
    return (b[0] >= a[0]) && (b[0] + b[2] <= a[0] + a[2]) &&
           (b[1] >= a[1]) && (b[1] + b[3] <= a[1] + a[3]);
}


/**
* check if a given point exists within a rect on the canvas
*
* @param {Point} point
* @param {Number} x location of the rect
* @param {Number} y location of the rect
* @param {Number} width of the rect
* @param {Number} height of the rect
* @returns {Boolean}
*/
function isPointWithinRect(point, x,y, width, height){
    return point.x >= x && point.x <= x + width &&
           point.y >= y && point.y <= y + height;
}


/**
* calculates the area of an ellipse
*
* @param {Number} rad_x
* @param {Number} rad_y
* @returns {Number}
*/
function getEllipseArea(rad_x, rad_y){
    return rad_x * rad_y * Math.PI;
}


/**
* given two matrices perform a dot product on them
* https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
*
* @param {Array[]} A
* @param {Array[]} B
* @returns {Array.<Array.<Number>>}
*/
function matrixDot (A, B) {
    const result = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((_, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0);
        });
    });
}


/**
* convert a point using the homography matrix based on the initial
* transformation done on the canvas
*
* @param {Point} p - the point to transform
* @returns {Point}
*/
function transformPoint(p, ratio){
    //use the transformation matrix to get the real canvas position
    const m = matrixDot(
        [[p.x, p.y]],
        [[ratio, 0, 0 ], [0, ratio, 0], [0,0,1]]
    )[0];

    //divide by ratio?
    return new Point(m[0]/ratio,m[1]/ratio);
}


/**
* gets the distance between two points
* @param {Point} p1
* @param {Point} p2
* @returns {Number}
*/
function getDistance(p1,p2){
    const a = Math.pow( p2.x - p1.x,2 );
    const b = Math.pow( p2.y - p1.y,2 );

    return Math.sqrt( a + b );
}


/**
* Given the x and y radius of an ecllipse, get the x,y values for
* the largest rectange that can be inscribed inside of the ecllipse
* @param {Number} rad_x
* @param {Number} rad_y
* @returns {Array.<Number>}
*/
function getInteriorBoundingBox(rad_x,rad_y){
    return [ rad_x / Math.sqrt(2), rad_y / Math.sqrt(2) ];
}


export {
    getDistance,
    isRectInRect,
    transformPoint,
    isWithinEllipse,
    getEllipseArea,
    isPointWithinRect,
    getInteriorBoundingBox,
};
