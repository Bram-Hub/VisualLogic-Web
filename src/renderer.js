

/**
* Draws the background grid, this also acts as a method
* of clearing the previous frame
*/
function renderGrid(context, width, height, line_width = 50){
	context.fillStyle = 'white';
	context.fillRect(0,0,width,height);

	//x direction
	for(var i = 0; i < width; i += line_width){

		context.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		context.beginPath();
		context.moveTo(i,0)
		context.lineTo(i, height);
		context.stroke();
	}

	//y direction
	for(var i = 0; i < height; i += line_width){

		context.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		context.beginPath();
		context.moveTo(0,i)
		context.lineTo(width, i);
		context.stroke();
	}

	return context;
}


/** 
* returns the device's pixel ratio for HiDPI displays 
* @return {Number}
*/
function getDeviceRatio () {
	let CONTEXT = CanavasManager.getInstance().Context;
    dpr = window.devicePixelRatio || 1,
    bsr = CONTEXT.webkitBackingStorePixelRatio ||
          CONTEXT.mozBackingStorePixelRatio ||
          CONTEXT.msBackingStorePixelRatio ||
          CONTEXT.oBackingStorePixelRatio ||
          CONTEXT.backingStorePixelRatio || 1;

    return dpr / bsr;
}


/**
* https://stackoverflow.com/questions/
* 15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
*
* corrects the canvas and resets the mouse pointer
*/
function onResize() {
	C_WIDTH = window.innerWidth;
	C_HEIGHT = window.innerHeight;
    MOUSE_POS = new Point(0,0);

    let CM = CanavasManager.getInstance();
    fixBlur(
    	CM.Canvas, 
    	CM.Context, 
    	C_WIDTH, C_HEIGHT
    );
}


function fixBlur(canvas, context, width, height){
	ratio = getDeviceRatio();
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    //                    a     b  c  d      e  f
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    /**
    [ a c e 
      b d f
      0 0 1
    ]
    */
}