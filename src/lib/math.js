/** @typedef { import('./point.js').Point } Point */

/**
* Given a point and a description of an ellipse determine if that point is 
* within that ellipse, the coordinates are assumed to represent HTML canvas points
* @param {Point} point the point being tested
* @param {Number} x the x position of the ellipse
* @param {Number} y the y position of the ellipse
* @param {Number} rad_x the radius in the x axis
* @param {Number} rad_y the radius in the y axis
* @return {Boolean}
*/
function isWithinEllipse(point, x, y, rad_x, rad_y){
	// (x-h)^2/a^2 + (y-k)^2/b^2 <= 1
	
	let a = Math.pow( point.x - x, 2) / Math.pow(rad_x, 2);
	let b = Math.pow( point.y - y, 2) / Math.pow(rad_y, 2);

	return a+b <= 1;	
}


/**
* check if a given value is between a certain tolerance (inclusive)
* @param {Number} tgt
* @param {Number} base
* @param {Number} tol 
* @return {Boolean}
*/
function isWithinTollerance(tgt, base, tol){
	return tgt >= ( base - tol ) && tgt <= ( base + tol );
}


/**
* check if a given point exists within a rect on the canvas
* @param {Point} point
* @param {Number} x location of the rect
* @param {Number} y location of the rect
* @param {Number} width of the rect
* @param {Number} height of the rect
* @return {Boolean}
*/
function isPointWithinRect(point, x,y, width, height){
	return point.x >= x && point.x <= x + width &&
		   point.y >= y && point.y <= y + height;	
}


/**
* calculates the area of an ellipse
* @param {Number} rad_x
* @param {Number} rad_y 
* @return {Number}
*/
function getEllipseArea(rad_x, rad_y){
	return rad_x * rad_y * Math.PI;
}


/**
* https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
* given two matrices perform a dot product on them
*
* @param {Array.<Number>} A
* @param {Array.<Number>} B
* @return {Array.<Array.<Number>>}
*/
function matrixDot (A, B) {
    var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
        })
    })
}


/**
* convert a point using the homography matrix based on the initial
* transformation done on the canvas
*
* @param {Point} p - the point to transform
* @return {Point}
*/
function transformPoint(p, ratio){
	//use the transformation matrix to get the real canvas position
	let m = matrixDot(
		[[p.x, p.y]], 
      	[[ratio, 0, 0 ], 
       	 [0, ratio, 0], 
       	 [0,0,1]]
    )[0];

	//divide by ratio?
    return new Point(m[0]/ratio,m[1]/ratio);
}