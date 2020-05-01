/** @typedef { import('./lib/point.js').Point } Point */


/**
*	Vector represents a 2D vector between two points in the canvas plane
*/
class Vector{
	/**
	* @constructor 
	* @param {Point} s the starting position
	* @param {Point} t the ending position
	*/
	constructor(s,t){
		this.start = s;
		this.end = t;

		this.r = getDistance(this.start, this.end);
		this.length = this.end.x - this.start.x;
		this.height = this.end.y - this.start.y;
		this.angle = Math.atan2(this.height,this.length);
		if (this.angle < 0){
			this.angle = (2 * Math.PI) + this.angle;
		}

		this.angle_degrees = this.angle * (180/Math.PI) ;

		this.left_to_right = this.length >= 0; 
		this.top_to_bot = this.height >= 0;
	}
}

/**
*@param {Vector} v draws a given vector, primarlly for debugging
*/
function drawVector(v){
	CONTEXT.beginPath();
	CONTEXT.moveTo(v.start.x, v.start.y);
	CONTEXT.lineTo(v.end.x,v.end.y);
	CONTEXT.stroke();
}