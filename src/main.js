var CANVAS, CONTEXT,
	C_WIDTH, C_HEIGHT,
	MOUSE_POS, CAMERA,
	CUTS = [];

var TMP_CUT = null;

function main(){
	//initialize application
	CANVAS = document.getElementById("canvas");
	if ( !CANVAS || !CANVAS.getContext("2d")){
		alert("Failed to initialized canvas element");
		return;
	}

	CANVAS.focus();
	CONTEXT = canvas.getContext("2d");
	C_WIDTH = window.innerWidth;
	C_HEIGHT = window.innerHeight;
	MOUSE_POS = new Point(0,0);

	CANVAS.style.width = C_WIDTH + "px";
	CANVAS.style.height = C_HEIGHT + "px";

	//fix canvas blurring
	//SRC : https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
	let dpi = window.devicePixelRatio;
	let style_height = +getComputedStyle(CANVAS).getPropertyValue("height").slice(0, -2);
	let style_width = +getComputedStyle(CANVAS).getPropertyValue("width").slice(0, -2);

	CANVAS.setAttribute('height', style_height * dpi);
	CANVAS.setAttribute('width', style_width * dpi);

	CAMERA = new Camera();

	// addCut(new Cut(new Point(C_WIDTH/2,C_HEIGHT/2)));
	// addCut(new Cut(new Point(C_WIDTH/2,C_HEIGHT/2)));

	initUserInput();
	renderLoop();
}


//main application loop
function renderLoop(){
	renderGrid();
	updateUserInput();

	IS_OVER_OBJ = false;
	for( c of CUTS ){
		c.update();
		drawCut(c);

		cutSelectionControl(c);

	}

	//we realeased the mouse and a temporary cut exists, now create it
	if ( !(TMP_CUT === null) && !IS_MOUSE_DOWN ){
		addCut(TMP_CUT);
	}


	if ( !IS_OVER_OBJ && IS_MOUSE_DOWN ){
		drawTemporaryCut(MOUSE_POS);
	}else{
		TMP_CUT = null;
		TMP_ORIGIN = null;
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

function cutSelectionControl(c){
	if ( c.is_mouse_in_border && IS_MOUSE_DOWN && CURRENT_OBJ === null ){
		CURRENT_OBJ = c.cut_border;
		IS_OVER_OBJ = true;
	}else if( c.is_mouse_in && CURRENT_OBJ === null && IS_MOUSE_DOWN ){
		IS_OVER_OBJ = true;
		CURRENT_OBJ = c;
	}
}