
var MINI_CONTEXT,
	M_HEIGHT, M_WIDTH, IS_MINI_OPEN = false,
	SCRATCH_CUTS = [],
	SCRATCH_SYMS = [],
	REQUEST;

function loadMini(){
	IS_MINI_OPEN = true;


	let CM = CanavasManager.getInstance();

	M_HEIGHT = CM.MiniCanvas.clientHeight; 
	M_WIDTH = CM.MiniCanvas.clientWidth;

	fixBlur(CM.MiniCanvas, CM.MiniContext, M_WIDTH, M_HEIGHT);
	renderMiniCanvas();
}


function toggleMiniRenderer(){
	let container = document.getElementById("mini-renderer");

	if(container.style.display != "none"){
		container.style.display = "none";
		cancelAnimationFrame(REQUEST);
	}else{
		container.style.display = "block";
		loadMini();
	}


	//once insert has been hit - change back to transform mode
	toggleMode();
}


//main application loop
function renderMiniCanvas(){
	let MINI_CONTEXT = CanavasManager.getInstance().MiniContext;
	renderGrid(MINI_CONTEXT, M_WIDTH, M_HEIGHT, 25);

	for ( s of SCRATCH_SYMS ){
		drawSymbol(s, MINI_CONTEXT);
	}

	REQUEST = requestAnimationFrame(renderMiniCanvas);
}