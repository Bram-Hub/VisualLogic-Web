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
*/
function isPointWithinRect(point, x,y, width, height){
	return point.x >= x && point.x <= x + width &&
		   point.y >= y && point.y <= y + height;	
}


/**
* calculates the area of an ellipse
* @param {Number} rad_x
* @param {Number} rad_y 
*/
function getEllipseArea(rad_x, rad_y){
	return rad_x * rad_y * Math.PI;
}