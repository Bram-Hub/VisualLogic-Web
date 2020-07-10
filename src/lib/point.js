
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


	leftOf(other){
		return this.x != other.x && this.x < other.x;
	}

	rightOf(other){
		return this.x != other.x && !this.leftOf(other);
	}

	above(other){
		return this.y != other.y && this.y < other.y;
	}

	below(other){
		return this.y != other.y && !this.above(other);
	}
}


export{
	Point
}