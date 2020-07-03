
var MINI_CONTEXT,
	M_HEIGHT, M_WIDTH,
	SCRATCH_CUTS = [],
	SCRATCH_SYMS = [],
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


	//once insert has been hit - change back to transform mode
	toggleMode();
}


//main application loop
function renderMiniCanvas(){
	let MINI_CONTEXT = CanvasManager.getInstance().MiniContext;
	renderGrid(MINI_CONTEXT, M_WIDTH, M_HEIGHT, 25);

	for ( s of SCRATCH_SYMS ){
		drawSymbol(s, MINI_CONTEXT);
	}

	REQUEST = requestAnimationFrame(renderMiniCanvas);
}