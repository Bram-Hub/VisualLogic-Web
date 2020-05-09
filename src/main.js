var CANVAS, CONTEXT,
	C_WIDTH, C_HEIGHT,
	MOUSE_POS, CAMERA,
	CUTS = [], TMP_CUT = null,
	SYMBOLS = [], DEBUG = true;

function main(){
	//initialize application
	CANVAS = document.getElementById("canvas");
	if ( !CANVAS || !CANVAS.getContext("2d")){
		alert("Failed to initialized canvas element");
		return;
	}

	CANVAS.focus();
	CONTEXT = canvas.getContext("2d");

	//initialze the canvas dimensions
	onResize();
	window.addEventListener("resize", onResize);

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
	MOUSE_OVER_OBJ = null;
	for( c of CUTS ){
		c.update();

		//cutSelectionControl(c);

		if ( c.is_mouse_over && DEBUG ){
			document.getElementById("debug").innerHTML = c.toString() + 
			"<br>" + c.child_cuts.length.toString();
		}

	}

	for ( s of SYMBOLS ){
		s.update();

		//symSelectionControl(s);

		if ( s.is_mouse_over && DEBUG ){
			document.getElementById("debug").innerHTML = s.toString();
		}
	}


	for ( c of CUTS ){
		drawCut(c);
	}

	for ( s of SYMBOLS ){
		drawSymbol(s);
	}

	//we realeased the mouse and a temporary cut exists, now create it
	if ( !(TMP_CUT === null) && !IS_MOUSE_DOWN ){
		addCut(TMP_CUT);
	}

	if ( IS_MOUSE_DOWN && SHIFT_DOWN ){
		drawTemporaryCut(MOUSE_POS);
	}else{
		TMP_CUT = null;
		TMP_ORIGIN = null;
	}

	if (CURRENT_OBJ)
		document.getElementById("debug").innerHTML += "<br>" + CURRENT_OBJ.toString();

	if ( DEBUG )
		drawDistancesOfCuts();	
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