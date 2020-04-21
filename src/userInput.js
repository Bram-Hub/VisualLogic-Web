var IS_DRAGGING, MOUSE_VEC,
	IS_MOVING, IS_MOUSE_DOWN,
	LAST_MOUSE_POS, IS_OVER_OBJ = false,
	CURRENT_OBJ = null;


function initUserInput(){
	CANVAS.addEventListener('mousedown', onMouseDown);
	CANVAS.addEventListener('mouseup', onMouseUp);
	CANVAS.addEventListener('mousemove', onMouseMove);
	window.addEventListener('keydown', whileKeyDown);
	window.addEventListener('onkeydown', whileKeyDown);

	IS_DRAGGING = IS_MOVING = IS_MOUSE_DOWN = false;
	LAST_MOUSE_POS = new Point(0,0);
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
}


function onMouseDown(e){
	IS_MOUSE_DOWN = true;
	LAST_MOUSE_POS = getRealMousePos(e);
}


function onMouseUp(e){
	IS_MOUSE_DOWN = false;

	if ( !IS_OVER_OBJ ){
		CURRENT_OBJ = null;
	}
}


function onMouseMove(e){
	IS_MOVING = true;

	MOUSE_VEC = new Vector(MOUSE_POS, getRealMousePos(e));
	MOUSE_POS = getRealMousePos(e);

}

function getRealMousePos(event){
	let x = event.clientX;
	let y = event.clientY;

	return new Point(x,y);
}

function whileKeyDown(e){
	if( e.keyCode === 39){
		//RIGHT_ARROW
	}
}