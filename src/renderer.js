import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {Point} from './lib/point.js';

/**
* Draws the background grid, this also acts as a method
* of clearing the previous frame
*/
function renderGrid(context, width, height, line_width = 50){
    context.fillStyle = 'white';
    context.fillRect(0,0,width,height);

    //x direction
    for(let i = 0; i < width; i += line_width){

        context.strokeStyle = i % 150 === 0 ? "#787878" : "#D0D0D0";

        context.beginPath();
        context.moveTo(i,0)
        context.lineTo(i, height);
        context.stroke();
    }

    //y direction
    for(let i = 0; i < height; i += line_width){

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
    let CONTEXT = CanvasManager.getInstance().Context;
    let dpr = window.devicePixelRatio              || 1,
        bsr = CONTEXT.webkitBackingStorePixelRatio ||
              CONTEXT.mozBackingStorePixelRatio    ||
              CONTEXT.msBackingStorePixelRatio     ||
              CONTEXT.oBackingStorePixelRatio      ||
              CONTEXT.backingStorePixelRatio       || 1;

    return dpr / bsr;
}


/**
* https://stackoverflow.com/questions/
* 15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
*
* corrects the canvas and resets the mouse pointer
*/
function onResize() {
    let CM = CanvasManager.getInstance();
    CM.c_width = window.innerWidth;
    CM.c_height = window.innerHeight;
    UserInputManager.getInstance().mouse_pos = new Point(0,0);

    fixBlur(
        CM.Canvas, 
        CM.Context, 
        CM.c_width, 
        CM.c_height
    );
}


function fixBlur(canvas, context, width, height){
    let ratio = getDeviceRatio();
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


function displayError(message){
    displayMessage(message, true);
}


function displaySuccess(message){
    displayMessage(message, false);
}

/**
* Display a message to the error
*
* @param {String} message - what to show
* @param {Boolean} error true if error/warning, false if notice/success 
*/
function displayMessage(message, error){
    let f = error ? console.error : console.log;
    f(message);

    let msg_buf = document.getElementById("msg-buff");
    let new_msg = document.createElement("div");

    let clss = error ? "msg err" : "msg";

    new_msg.setAttribute("class", clss);
    new_msg.innerHTML = message;
    msg_buf.appendChild(new_msg);

    setTimeout(function(){ 
        msg_buf.innerHTML = "";
    }, 3000);
}


function renderProofTexture(inner_style){
    let scratch = document.createElement("canvas");
    let scratch_ctx = scratch.getContext('2d');
    const CM = CanvasManager.getInstance();

    scratch.width = 50;
    scratch.height = 50;

    scratch_ctx.fillStyle = inner_style;
    scratch_ctx.globalAlpha = 0.7;
    scratch_ctx.fillRect(0,0,scratch.width,scratch.height);
        scratch_ctx.fillStyle = 'green';
    scratch_ctx.fillRect(0, 0, scratch.width/2, scratch.height);
    //scratch_ctx.fillRect(25, 25, scratch.width/2, scratch.height/2);


    scratch_ctx.stroke();

    let ptn = scratch_ctx.createPattern(scratch, 'repeat');
    return ptn;
}

export {
    onResize,
    renderGrid,
    getDeviceRatio,
    fixBlur,
    displayError,
    displaySuccess,
    renderProofTexture
}