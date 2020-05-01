

class Symbol{
	constructor(letter){
		this.letter = letter;
		this.x = MOUSE_POS.x;
		this.y = MOUSE_POS.y;

		this.real_x = this.x + 5;
		this.real_y = this.y + 50;

		this.width = 50;
		this.height = 50;

		this.center_pos 
	}
}

function addSymbol(sym){
	SYMBOLS.push(sym);
}

function drawSymbol(sym){
	CONTEXT.fillStyle = "black";
	CONTEXT.font = "italic 70px Times New Roman";

	CONTEXT.fillText(sym.letter, sym.real_x, sym.real_y); 

	if ( DEBUG ){
		CONTEXT.beginPath();
		CONTEXT.rect(sym.x, sym.y, sym.width, sym.height);
		CONTEXT.stroke();
	}
}