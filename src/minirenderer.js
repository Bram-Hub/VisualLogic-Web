
var MINI_CANVAS, MINI_CONTEXT,
	M_HEIGHT, M_WIDTH, IS_MINI_OPEN = false,
	SCRATCH_CUTS = [],
	SCRATCH_SYMS = [];

function loadMini(){
	MINI_CANVAS = document.getElementById("mini-canvas");
	if ( !CANVAS || !CANVAS.getContext("2d")){
		alert("Failed to initialized mini canvas element");
		return;
	}

	IS_MINI_OPEN = true;

	MINI_CONTEXT = MINI_CANVAS.getContext("2d");
	M_HEIGHT = MINI_CANVAS.clientHeight; 
	M_WIDTH = MINI_CANVAS.clientWidth;

	fixBlur(MINI_CANVAS, MINI_CONTEXT, M_WIDTH, M_HEIGHT);
	renderMiniCanvas();
}


//main application loop
function renderMiniCanvas(){
	MINI_CONTEXT = renderGrid(MINI_CONTEXT, M_WIDTH, M_HEIGHT, 25);

	for ( s of SCRATCH_SYMS ){
		drawSymbol(s, MINI_CONTEXT);
	}

	requestAnimationFrame(renderMiniCanvas);
}