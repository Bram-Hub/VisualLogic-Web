

/**
* Draws the background grid, this also acts as a method
* of clearing the previous frame
*/
function renderGrid(){
	CONTEXT.fillStyle = 'white';
	CONTEXT.fillRect(0,0,C_WIDTH,C_HEIGHT);

	//x direction
	let line_width = 50;
	for(var i = 0; i < C_WIDTH; i += line_width){

		CONTEXT.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		CONTEXT.beginPath();
		CONTEXT.moveTo(i,0)
		CONTEXT.lineTo(i, C_HEIGHT);
		CONTEXT.stroke();
	}

	//y direction
	for(var i = 0; i < C_HEIGHT; i += line_width){

		CONTEXT.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

		CONTEXT.beginPath();
		CONTEXT.moveTo(0,i)
		CONTEXT.lineTo(C_WIDTH, i);
		CONTEXT.stroke();
	}
}


/** 
* returns the device's pixel ratio for HiDPI displays 
* @return {Number}
*/
function getDeviceRatio () {
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


    ratio = getDeviceRatio();
    CANVAS.width = C_WIDTH * ratio;
    CANVAS.height = C_HEIGHT * ratio;
    CANVAS.style.width = C_WIDTH + "px";
    CANVAS.style.height = C_HEIGHT + "px";
    //                    a     b  c  d      e  f
    CONTEXT.setTransform(ratio, 0, 0, ratio, 0, 0);
    /**
    [ a c e 
      b d f
      0 0 1
    ]
    */
}
