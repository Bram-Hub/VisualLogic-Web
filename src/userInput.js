var IS_DRAGGING, MOUSE_VEC,
	IS_MOVING, IS_MOUSE_DOWN,
	LAST_MOUSE_POS, SHIFT_DOWN,
	MOUSE_OVER_OBJ = null,
	IS_OVER_OBJ = false,
	CURRENT_OBJ = null;


function initUserInput(){
	CANVAS.addEventListener('mousedown', onMouseDown);
	CANVAS.addEventListener('mouseup', onMouseUp);
	CANVAS.addEventListener('mousemove', onMouseMove);
	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	IS_DRAGGING = IS_MOVING = IS_MOUSE_DOWN = 
	SHIFT_DOWN = false;

	//assume the cursor's position is in the center of the page on load
	MOUSE_POS = new Point(C_WIDTH/2, C_HEIGHT/2);
	LAST_MOUSE_POS = MOUSE_POS;
}


function updateUserInput(){
	IS_DRAGGING = IS_MOUSE_DOWN && IS_MOVING;
	IS_MOVING = false;

	//console.log(IS_DRAGGING, CURRENT_OBJ);
	if ( IS_DRAGGING && CURRENT_OBJ === null ){
		CAMERA.updatePan( LAST_MOUSE_POS, MOUSE_POS );
	}

	if ( IS_DRAGGING && !(CURRENT_OBJ === null) ){
		CURRENT_OBJ.updatePos( MOUSE_POS );
	}

	if ( CURRENT_OBJ === null ){
		document.getElementById("canvas").style.cursor = "default"; 
	}
}


function onMouseDown(e){
	IS_MOUSE_DOWN = true;
	LAST_MOUSE_POS = getRealMousePos(e);


	if ( SHIFT_DOWN )
		return;

	//are we over anything
	for (c of CUTS){
		if ( c.is_mouse_over ){
			CURRENT_OBJ = mouseOverInnerMost(c);
			break;
		}
	}

	for (s of SYMBOLS){
		if ( s.is_mouse_over ){
			CURRENT_OBJ = s;
			break;
		}
	}

}


function onMouseUp(e){
	IS_MOUSE_DOWN = false;
	CURRENT_OBJ = null;
}


function onMouseMove(e){
	IS_MOVING = true;

	MOUSE_VEC = new Vector(MOUSE_POS, getRealMousePos(e));
	MOUSE_POS = getRealMousePos(e);

	//TODO find a better a time to figure this out
	recalculateChildCuts();
}


function getRealMousePos(event){
	let x = event.clientX;
	let y = event.clientY;

	return new Point(x,y);
}


function onKeyDown(e){
	if ( e.code === "ShiftLeft" || e.code === "ShiftRight" ){
		SHIFT_DOWN = true;
	}
}




function onKeyUp(e){
	if ( e.keyCode === 27 ){
		//user decides to not create a cut, clear the temporary
		TMP_CUT = null;
	}else if( e.code === "ShiftLeft" || e.code === "ShiftRight" ){
		SHIFT_DOWN = false;
	}else if( isAlpha(e.code) ){
		addSymbol( new Symbol(e.code[3]) );
	}


	function isAlpha(tgt){
		if ( tgt.length != 4 )
			return false;

		let n = tgt.charCodeAt(3);
		return n >=65 && n <= 90;
	}
}