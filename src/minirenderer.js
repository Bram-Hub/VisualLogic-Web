
var M_HEIGHT, M_WIDTH,
	REQUEST;

function loadMini(){
	let CM = CanvasManager.getInstance();
	CM.is_mini_open = true;

	M_HEIGHT = CM.MiniCanvas.clientHeight; 
	M_WIDTH = CM.MiniCanvas.clientWidth;

	fixBlur(CM.MiniCanvas, CM.MiniContext, M_WIDTH, M_HEIGHT);
	renderMiniCanvas();
}


function toggleMiniRenderer(){
	let container = document.getElementById("mini-renderer");
	let CM = CanvasManager.getInstance();

	if(container.style.display != "none"){
		container.style.display = "none";
		cancelAnimationFrame(REQUEST);
		CM.is_mini_open = false;
	}else{
		container.style.display = "block";
		loadMini();
		CM.is_mini_open = true;
	}

	let btn = document.getElementById("exit-mini");
	btn.style.left = CM.MiniCanvas.offsetLeft + "px";

	//once insert has been hit - change back to transform mode
	toggleMode();
}


//main application loop
function renderMiniCanvas(){
	let CM = CanvasManager.getInstance();
	renderGrid(CM.MiniContext, M_WIDTH, M_HEIGHT, 25);
	updateUserInput();


	if( DEBUG ){
		document.getElementById("debug").innerHTML = "";
	}

	for( let c of CM.s_cuts ){
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

	for ( let s of CM.s_syms ){
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


	for ( let c of CM.s_cuts ){
		drawCut(c);
	}

	for ( let s of CM.s_syms ){
		drawSymbol(s);
	}

	//we realeased the mouse and a temporary cut exists, now create it
	if ( !(TMP_CUT === null) && !IS_MOUSE_DOWN ){
		addCut(TMP_CUT);
	}


	if ( IS_MOUSE_DOWN && SHIFT_DOWN && !PROOF_MODE ){
		drawTemporaryCut(MOUSE_POS);
	}else{
		TMP_CUT = null;
		TMP_ORIGIN = null;
	}

	REQUEST = requestAnimationFrame(renderMiniCanvas);
}