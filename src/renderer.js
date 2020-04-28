

/**
* Draws the background grid, this also acts as a method
* of clearing the previous frame
*/
function renderGrid(){
	CONTEXT.fillStyle = 'white';
	CONTEXT.fillRect(0,0,C_WIDTH,C_HEIGHT);

	//x direction
	let line_width = 50;
	for(var i = 0; i < C_WIDTH; i += line_width){

		CONTEXT.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		CONTEXT.beginPath();
		CONTEXT.moveTo(i,0)
		CONTEXT.lineTo(i, C_HEIGHT);
		CONTEXT.stroke();
	}

	//y direction
	for(var i = 0; i < C_HEIGHT; i += line_width){

		CONTEXT.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		CONTEXT.beginPath();
		CONTEXT.moveTo(0,i)
		CONTEXT.lineTo(C_WIDTH, i);
		CONTEXT.stroke();
	}
}



function onResize(){
	C_WIDTH = window.innerWidth;
	C_HEIGHT = window.innerHeight;
	MOUSE_POS = new Point(0,0);

	CANVAS.style.width = C_WIDTH + "px";
	CANVAS.style.height = C_HEIGHT + "px";

	let dpi = window.devicePixelRatio;
	let style_height = +getComputedStyle(CANVAS).getPropertyValue("height").slice(0, -2);
	let style_width = +getComputedStyle(CANVAS).getPropertyValue("width").slice(0, -2);

	CANVAS.setAttribute('height', style_height * dpi);
	CANVAS.setAttribute('width', style_width * dpi);
}