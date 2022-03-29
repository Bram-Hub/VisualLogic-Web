import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {Point} from './lib/point.js';
import {isPointWithinRect} from './lib/math.js';
import {DEBUG} from './main.js';

/**
* A symbol represents a boolean variable in the sheet of assertion
* Called symbolic since Symbol reserved by JS 
*/
class Symbolic{
    /** 
     * @param {String} letter charactor representing the symbol
     * @param {Point} position
     */
    constructor(letter, position){

        this.letter = letter;
        this.x = position.x;
        this.y = position.y;

        this.real_x = this.x - 25;
        this.real_y = this.y + 25;

        this.width = 50;
        this.height = 50;

        this.is_mouse_over = false;

        this.id = CanvasManager.getNextId();
        this.level = 0;

        this.is_proof_selected = false;

        this.area = this.width * this.height;
    }

    center(){
        return new Point(this.x,this.y);
    }

    isEvenLevel(){
        return this.level % 2 == 0;
    }

    update(){
        this.is_mouse_over = isPointWithinRect(
            UserInputManager.mouse_pos, 
            this.x - 25, 
            this.y - 25, 
            this.width, 
            this.height
        );
    }

    /**
     * Update this objects position, if root the last mouse position will be updated as well
     * 
     * @param {Point} new_pos 
     * @param {Boolean|null} root (true by default)
    */
    updatePos( new_pos, root = true ){
        let UM = UserInputManager; 
        let dx = new_pos.x - UM.last_mouse_pos.x;
        let dy = new_pos.y - UM.last_mouse_pos.y;

        this.x += dx;
        this.y += dy;

        this.real_x = this.x - 25;
        this.real_y = this.y + 25;

        if ( root ){
            UserInputManager.last_mouse_pos = new_pos;
        }
    }

    /** 
     * Get this object's ID
     * 
     * @returns {String} 
     * */
    toString(){
        return this.id.toString();
    }

    /**
     * Serialize this object into a JSON string
     *  
     * @returns {String} 
     * */
    serialize(){
        return JSON.stringify(this);
    }


    /**
    * Render a given symbol on whichever context is opened
    */
    draw(){

        let context = CanvasManager.getContext();
        context.fillStyle = this.is_mouse_over ? 'blue' : 'black';

        if(this.is_proof_selected){
            context.fillStyle = 'green';
        }

        //TODO: store this somewhere and allow UI scaling with the size of a symbol
        const font_size = '70px';
        context.font = `italic ${font_size} Times New Roman`;

        context.fillText(this.letter, this.real_x, this.real_y); 

        if ( DEBUG ){
            context.beginPath();
            context.rect(this.x - 25, this.y - 25, this.width, this.height);
            context.stroke();
        }
    }
}


export {
    Symbolic
};
