import {getDistance} from './math.js';
import {CanvasManager} from '../canvasManager.js';


/**
*   Vector represents a 2D vector between two points in the canvas plane
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

        this.angle_degrees = this.angle * (180/Math.PI) ;
    }

    /**
    * draws a this vector, primarily for debugging
    */
    drawVector(){
        const context = CanvasManager.getContext();

        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }
}


export {
    Vector
};
