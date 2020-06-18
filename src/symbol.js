/** @typedef { import('./lib/point.js').Point } Point */

/**
* A symbol represents a boolean variable in the sheet of assertion
*/
class Symbol{
	/**
	* @constructor 
	* @param {String} The charactor representing the symbol
	*/
	constructor(letter){
		this.letter = letter;
		this.x = MOUSE_POS.x;
		this.y = MOUSE_POS.y;

		this.real_x = this.x - 25;
		this.real_y = this.y + 25;

		this.width = 50;
		this.height = 50;

		this.center = new Point(this.real_x, this.real_y);
		this.is_mouse_over = false;

		this.id = Date.now().toString() + getRandomString();
	}

	update(){
		this.is_mouse_over = isMouseOverSym(this);
		if (this.is_mouse_over)
			MOUSE_OVER_OBJ = this;
	}

	updatePos( new_pos, root = true ){
		let dx = new_pos.x - LAST_MOUSE_POS.x;
		let dy = new_pos.y - LAST_MOUSE_POS.y;

		this.x += dx;
		this.y += dy;

		this.real_x = this.x - 25;
		this.real_y = this.y + 25;

		this.center = new Point(this.real_x, this.real_y);

		if ( root ){
			LAST_MOUSE_POS = new_pos;
		}
	}

	toString(){
		return this.id;
	}
}

function addSymbol(sym){
	SYMBOLS.push(sym);
	CutManager.getInstance().addObj(sym);
}

function drawSymbol(sym){
	CONTEXT.fillStyle = sym.is_mouse_over ? "blue" : "black";
	CONTEXT.font = "italic 70px Times New Roman";

	CONTEXT.fillText(sym.letter, sym.real_x, sym.real_y); 

	if ( DEBUG ){
		CONTEXT.beginPath();
		CONTEXT.rect(sym.x - 25, sym.y - 25, sym.width, sym.height);
		CONTEXT.stroke();
	}
}


function isMouseOverSym(sym){
	return isPointWithinRect(MOUSE_POS, sym.x - 25, sym.y - 25, sym.width, sym.height);
}