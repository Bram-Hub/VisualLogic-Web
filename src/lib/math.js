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


function isWithinTollerance(tgt, base, tol){
	return tgt >= ( base - tol ) && tgt <= ( base + tol );
}