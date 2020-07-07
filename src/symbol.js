import {CanvasManager} from './canvasManager.js';
import {UserInputManager, toggleMode} from './userInput.js';
import {Point} from './lib/point.js';
import {getRandomString} from './main.js';
import {CutManager} from './cutmanager.js';
import {isPointWithinRect} from './lib/math.js';
import {DEBUG} from './main.js';
/** @typedef { import('./lib/point.js').Point } Point */

/**
* A symbol represents a boolean variable in the sheet of assertion
* Called symbolic since Symbol reserved by JS 
*/
class Symbolic{
    /**
    * @constructor 
    * @param {String} The charactor representing the symbol
    */
    constructor(letter){

        let UM = UserInputManager.getInstance();

        this.letter = letter;
        this.x = UM.mouse_pos.x;
        this.y = UM.mouse_pos.y;

        this.real_x = this.x - 25;
        this.real_y = this.y + 25;

        this.width = 50;
        this.height = 50;

        this.center = new Point(this.real_x, this.real_y);
        this.is_mouse_over = false;

        this.id = Date.now().toString() + getRandomString();
        this.level = 1;
    }

    update(){
        let UM = UserInputManager.getInstance();
        this.is_mouse_over = isMouseOverSym(this);
        if (this.is_mouse_over){
            UM.obj_under_mouse = this;
        }
    }

    updatePos( new_pos, root = true ){
        let UM = UserInputManager.getInstance(); 
        let dx = new_pos.x - UM.last_mouse_pos.x;
        let dy = new_pos.y - UM.last_mouse_pos.y;

        this.x += dx;
        this.y += dy;

        this.real_x = this.x - 25;
        this.real_y = this.y + 25;

        this.center = new Point(this.real_x, this.real_y);

        if ( root ){
            UserInputManager.getInstance().last_mouse_pos = new_pos;
        }
    }

    toString(){
        return this.id;
    }
}


function addSymbol(sym){
    let CM = CanvasManager.getInstance();
    if(CM.is_mini_open){
        CM.s_syms.push(sym);
        return;
    }


    CM.syms.push(sym);
    CutManager.getInstance().addObj(sym);
}

function drawSymbol(sym){

    let context = CanvasManager.getInstance().getContext();
    context.fillStyle = sym.is_mouse_over ? "blue" : "black";
    context.font = "italic 70px Times New Roman";

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
        UserInputManager.getInstance().mouse_pos, 
        sym.x - 25, sym.y - 25, 
        sym.width, sym.height
    );
}


export {
    Symbolic,
    drawSymbol,
    addSymbol
}