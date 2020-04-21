var CANVAS, CONTEXT,
	C_WIDTH, C_HEIGHT,
	MOUSE_POS, CAMERA,
	CUTS = [];


function main(){
	//initialize application
	CANVAS = document.getElementById("canvas");
	if ( !CANVAS || !CANVAS.getContext("2d")){
		alert("Failed to initialized canvas element");
		return;
	}

	CONTEXT = canvas.getContext("2d");
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

	CAMERA = new Camera();

	addCut(new Cut(new Point(C_WIDTH/2,C_HEIGHT/2)));
	initUserInput();
	renderLoop();
}


function renderLoop(){
	renderGrid();
	updateUserInput();

	IS_OVER_OBJ = false;
	for( c of CUTS ){
		c.update();
		drawCut(c);

		if ( c.is_mouse_over && CURRENT_OBJ === null && IS_MOUSE_DOWN ){
			IS_OVER_OBJ = true;
			CURRENT_OBJ = c;
		}

	}

	requestAnimationFrame(renderLoop);
}


function getRandomString(){
	var array = new Uint32Array(2);
	window.crypto.getRandomValues(array);

	let ret = '';
	for (var i = 0; i < array.length; i++) {
		ret += array[i].toString();
	}

	return ret;
}

