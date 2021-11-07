import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {Point} from './lib/point.js';
import {getRandomString} from './main.js';
import {isPointWithinRect} from './lib/math.js';
import {DEBUG} from './main.js';
/** @typedef { import('./lib/point.js').Point } Point */

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

        this.center = new Point(this.real_x, this.real_y);
        this.is_mouse_over = false;

        this.id = getRandomString();
        this.level = 1;

        this.is_proof_selected = false;

        this.area = this.width * this.height;
    }

    update(){
        let UM = UserInputManager;
        this.is_mouse_over = isMouseOverSym(this);
        if (this.is_mouse_over){
            UM.obj_under_mouse = this;
        }
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

        this.center = new Point(this.real_x, this.real_y);

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
        return this.id;
    }

    /**
     * Serialize this object into a JSON string
     *  
     * @returns {String} 
     * */
    serialize(){
        return JSON.stringify(this);
    }
}


/**
* Render a given symbol on whichever context is opened
*
* @param {Symbolic} sym
*/
function drawSymbol(sym){

    let context = CanvasManager.getContext();
    context.fillStyle = sym.is_mouse_over ? 'blue' : 'black';

    if(sym.is_proof_selected){
        context.fillStyle = 'green';
    }

    context.font = 'italic 70px Times New Roman';

    context.fillText(sym.letter, sym.real_x, sym.real_y); 

    if ( DEBUG ){
        context.beginPath();
        context.rect(sym.x - 25, sym.y - 25, sym.width, sym.height);
        context.stroke();
    }
}


/**
* is the mouse over a symbol
* 
* @param {Symbol} sym - symbol to check
* @returns {Boolean}
*/
function isMouseOverSym(sym){
    return isPointWithinRect(
        UserInputManager.mouse_pos, 
        sym.x - 25, sym.y - 25, 
        sym.width, sym.height
    );
}


export {
    Symbolic,
    drawSymbol,
};
