

function initUserInput(){
	CANVAS.addEventListener('mousedown', onMouseDown);
	CANVAS.addEventListener('mouseup', onMouseUp);
	CANVAS.addEventListener('mousemove', onMouseMove);
}

function onMouseDown(e){
	console.log(e);
}

function onMouseUp(e){

}

function onMouseMove(e){
	MOUSE_POS.update(e.clientX,e.clientY);
}