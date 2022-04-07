import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {Point} from './lib/point.js';
import {Vector} from './lib/vector.js';

/**
* Draws the background grid, this also acts as a method
* of clearing the previous frame
*
* @param {CanvasRenderingContext2D}
* @param {Number} width
* @param {Number} height
* @param {Number|null} line_width (50 by default)
* @returns {CanvasRenderingContext2D}
*/
function renderGrid(context, width, height, line_width = 50){
    context.fillStyle = 'white';
    context.fillRect(0,0,width,height);

    //x direction
    for (let i = 0; i < width; i += line_width){

        context.strokeStyle = i % 150 === 0 ? '#787878' : '#D0D0D0';

        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i, height);
        context.stroke();
    }

    //y direction
    for (let i = 0; i < height; i += line_width){

        context.strokeStyle = i % 150 === 0 ? '#787878' : '#D0D0D0';

        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(width, i);
        context.stroke();
    }

    return context;
}


/**
* returns the device's pixel ratio for HiDPI displays
*
* @returns {Number}
*/
function getDeviceRatio () {
    const context = CanvasManager.Context;
    const dpr = window.devicePixelRatio              || 1;
    const bsr = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio    ||
                context.msBackingStorePixelRatio     ||
                context.oBackingStorePixelRatio      ||
                context.backingStorePixelRatio       || 1;

    return dpr / bsr;
}


/**
* https://stackoverflow.com/questions/
* 15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
*
* corrects the canvas and resets the mouse pointer
*/
function onResize() {
    const CM = CanvasManager;
    CM.c_width = window.innerWidth;
    CM.c_height = window.innerHeight;
    UserInputManager.mouse_pos = new Point(0,0);

    fixBlur(
        CM.Canvas,
        CM.Context,
        CM.c_width,
        CM.c_height
    );
}

/**
 * TODO: use canvasManager instead of passing in variables
 * TODO: just scale the entire canvas up by the device pixel ratio
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2DSettings} context
 * @param {Number} width
 * @param {Number} height
 */
function fixBlur(canvas, context, width, height){
    const ratio = getDeviceRatio();
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    //                    a     b  c  d      e  f
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    /**
    [ a c e
      b d f
      0 0 1
    ]
    */
}

/** @param {String} message*/
function displayError(message){
    displayMessage(message, true);
    return false;
}

/** @param {String} message*/
function displaySuccess(message){
    displayMessage(message, false);
    return true;
}

/**
* Display a message to the error
*
* @param {String} message - what to show
* @param {Boolean} error true if error/warning, false if notice/success
*/
function displayMessage(message, error){
    const f = error ? console.error : console.log;
    f(message);

    const msg_buf = document.getElementById('msg-buff');
    const new_msg = document.createElement('div');

    const clss = error ? 'msg err' : 'msg';

    new_msg.setAttribute('class', clss);
    new_msg.innerHTML = message;
    msg_buf.appendChild(new_msg);

    setTimeout(()=> {
        msg_buf.innerHTML = '';
    }, 3000);
}

/**
 * Create a texture that will display over a cut's area to indicate its selected in proof mode
 *
 * @param {String} inner_style - fill style of the cut
 * @returns {CanvasPattern}
 * */
function renderProofTexture(inner_style){
    const scratch = document.createElement('canvas');
    const scratch_ctx = scratch.getContext('2d');

    scratch.width = 50;
    scratch.height = 50;

    scratch_ctx.fillStyle = inner_style;
    scratch_ctx.globalAlpha = 0.7;
    scratch_ctx.fillRect(0,0,scratch.width,scratch.height);
    scratch_ctx.fillStyle = 'green';
    scratch_ctx.fillRect(0, 0, scratch.width/2, scratch.height);
    scratch_ctx.stroke();

    return scratch_ctx.createPattern(scratch, 'repeat');
}

/**
* Draw a dot on the current opened canvas
*
* @param {Point}
* @param {Number|null} rad - radius of the dot, (default 10)
* @param {String|null} col - color of the dot (default red)
*/
function drawPoint(Point, rad = 10, col='red'){
    const context = CanvasManager.getContext();

    context.beginPath();
    context.fillStyle = col;
    context.arc(Point.x,Point.y, rad, 0,2*Math.PI);
    context.fill();
}


function drawDistancesOfCuts(){
    const CM = CanvasManager;

    for (const i of CM.cuts){
        for (const j of CM.cuts){
            if ( j === i ){
                continue;
            }

            new Vector( i.center(), j.center() ).drawVector();
        }
    }

}


function renderDebugInfo(){
    const CM = CanvasManager;
    for ( const c of CM.getCuts() ){
        if ( c.is_mouse_over ){
            const childs = `<br>Child Cuts : ${c.child_cuts.length}`;
            document.getElementById('debug').innerHTML = `${c.toString()}<br>Level : ${c.level.toString()}${childs}<br>${c.bounded_area.toString()}`;
        }
    }

    for ( const s of CM.getSyms() ){
        if ( s.is_mouse_over ){
            document.getElementById('debug').innerHTML = `${s.toString()
            }<br>Level : ${s.level.toString()}`;
        }
    }

    drawDistancesOfCuts();
    if (UserInputManager.current_obj){
        document.getElementById('debug').innerHTML += `<br>Current : ${UserInputManager.current_obj.toString()}`;
    }
}


export {
    onResize,
    renderGrid,
    getDeviceRatio,
    fixBlur,
    displayError,
    displaySuccess,
    renderProofTexture,
    drawPoint,
    renderDebugInfo
};
