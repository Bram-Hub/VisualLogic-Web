

class Symbol{
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
	}

	updatePos( new_pos ){
		this.x = new_pos.x;
		this.y = new_pos.y;

		this.real_x = this.x - 25;
		this.real_y = this.y + 25;

		this.center = new Point(this.real_x, this.real_y);
	}

	toString(){
		return this.id;
	}
}

function addSymbol(sym){
	SYMBOLS.push(sym);
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