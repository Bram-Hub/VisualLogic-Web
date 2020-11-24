
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

  
    // Comparison functions, quickly check position of this point relative to another

    /** 
     * @param {Point} other 
     * @returns {Boolean}
    */
    leftOf(other){
        return this.x != other.x && this.x < other.x;
    }

    /** 
     * @param {Point} other 
     * @returns {Boolean}
    */
    rightOf(other){
        return this.x != other.x && !this.leftOf(other);
    }

    /** 
     * @param {Point} other 
     * @returns {Boolean}
    */
    above(other){
        return this.y != other.y && this.y < other.y;
    }

    /** 
     * @param {Point} other 
     * @returns {Boolean}
    */
    below(other){
        return this.y != other.y && !this.above(other);
    }
}


export{
    Point
};