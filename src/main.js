var CONTEXT,
	C_WIDTH, C_HEIGHT,
	MOUSE_POS, CAMERA,
	TMP_CUT = null, DEBUG = true;

function main(){
	//initialize application
	let canvas = document.getElementById("canvas");
	if ( !canvas || !canvas.getContext("2d")){
		alert("Failed to initialized canvas element");
		return;
	}

	let mini_canvas = document.getElementById("mini-canvas");

	if ( !mini_canvas || !mini_canvas.getContext("2d")){
		alert("Failed to initialized mini canvas element");
		return;
	}

	CanvasManager.init(canvas, mini_canvas);
	CanvasManager.getInstance().Canvas.focus();

	//initialze the canvas dimensions
	onResize();
	window.addEventListener("resize", onResize);

	CAMERA = new Camera();

	initUserInput();
	renderLoop();

	//load default mode
	let mode = localStorage.getItem("proof_mode");
	if(!mode){
		localStorage.setItem("proof_mode", "active");
	}else if(mode === "active"){
		toggleMode();
	}

}


//main application loop
function renderLoop(){
	let CM = CanvasManager.getInstance();
	let CONTEXT = CM.Context;

	renderGrid(CONTEXT, C_WIDTH, C_HEIGHT);
	updateUserInput();

	IS_OVER_OBJ = false;
	MOUSE_OVER_OBJ = null;

	if( DEBUG ){
		document.getElementById("debug").innerHTML = "";
	}

	for( let c of CM.cuts ){
		c.update();

		//cutSelectionControl(c);

		if ( c.is_mouse_over && DEBUG ){
			document.getElementById("debug").innerHTML = c.toString() + 
			"<br>Level : " + c.level.toString();
		}


		if ( c.is_mouse_over ){
			MOUSE_OVER_OBJ = c;
			IS_OVER_OBJ = true;
		}

	}

	for ( let s of CM.syms ){
		s.update();

		//symSelectionControl(s);

		if ( s.is_mouse_over && DEBUG ){
			document.getElementById("debug").innerHTML = s.toString();
		}


		if ( s.is_mouse_over ){
			MOUSE_OVER_OBJ = s;
			IS_OVER_OBJ = true;
		}
	}


	for ( let c of CM.cuts ){
		drawCut(c);
	}

	for ( let s of CM.syms ){
		drawSymbol(s);
	}

	//we realeased the mouse and a temporary cut exists, now create it
	if ( !(TMP_CUT === null) && !IS_MOUSE_DOWN ){
		CM.addCut(TMP_CUT);
	}

	if ( IS_MOUSE_DOWN && SHIFT_DOWN && !PROOF_MODE ){
		drawTemporaryCut(MOUSE_POS);
	}else{
		TMP_CUT = null;
		TMP_ORIGIN = null;
	}

	if (CURRENT_OBJ){
		document.getElementById("debug").innerHTML += "<br>Current : " + CURRENT_OBJ.toString();
	}

	if ( DEBUG )
		drawDistancesOfCuts();	

	requestAnimationFrame(renderLoop);
}


/**
* create a unique random string
* @return {String}
*/
function getRandomString(){
	var array = new Uint32Array(2);
	window.crypto.getRandomValues(array);

	let ret = '';
	for (var i = 0; i < array.length; i++) {
		ret += array[i].toString();
	}

	return ret;
}