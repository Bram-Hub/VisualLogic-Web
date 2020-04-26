
/**
* Point represents a 2D point on the canvas 
*/
class Point{
	/**
	* @constructor
	* @param {Number} x_ x position
	* @param {Number} y_ y position, (canvas value not cartesian)
	*/
	constructor(x_,y_){
		this.x = x_;
		this.y = y_;
	}


	/**
	* @param {Number} x_ x position
	* @param {Number} y_ y position, (canvas value not cartesian)
	*/
	update(x_,y_){
		this.x = x_;
		this.y = y_;
	}	
}

/**
* gets the distance between two points
* @param {Point} p1 
* @param {Point} p2
*/
function getDistance(p1,p2){
	let a = Math.pow( p2.x - p1.x,2 );
	let b = Math.pow( p2.y - p1.y,2 );

	return Math.sqrt( a + b );
}