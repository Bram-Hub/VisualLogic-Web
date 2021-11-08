import {CanvasManager, InitializeCanvasManager, loadState} from './canvasManager.js';
import {onResize, renderGrid, drawDistancesOfCuts} from './renderer.js';
import {UserInputManager, InitializeUserInputManager, toggleMode} from './userInput.js';
import {drawTemporaryCut, drawCut} from './cut.js';
import {drawSymbol} from './symbol.js';

var DEBUG = document.getElementById('debug').dataset.debugMode === 'true';

/**
* Entry Point of the program
* Init application and begin main render loop
*/
window.onload = () => {
    //initialize application
    let canvas = document.getElementById('canvas');
    if ( !canvas || !canvas.getContext('2d')){
        alert('Failed to initialized canvas element');
        return;
    }

    let mini_canvas = document.getElementById('mini-canvas');
    if ( !mini_canvas || !mini_canvas.getContext('2d')){
        alert('Failed to initialized mini canvas element');
        return;
    }

    InitializeCanvasManager(canvas, mini_canvas);
    InitializeUserInputManager();

    canvas.focus();

    //init the canvas dimensions
    onResize();
    window.addEventListener('resize', onResize);

    //load default mode
    let mode = localStorage.getItem('proof_mode');
    if(!localStorage.getItem('proof_mode')){
        localStorage.setItem('proof_mode', 'active');
    }else if(mode === 'active'){
        toggleMode();
    }

    //load previous data
    if(localStorage.getItem('save-state')){
        loadState('localStorage');
    }


    window.onbeforeunload = () => {
        //save to browser before leaving
        CanvasManager.save();
    };

    //start app
    renderLoop();

};


//main application loop
function renderLoop(){
    let CM = CanvasManager;
    let UM = UserInputManager;

    renderGrid(CM.Context, CM.c_width, CM.c_height);
    UM.obj_under_mouse = null;
    UM.update();

    if( DEBUG ){
        document.getElementById('debug').innerHTML = '';
    }

    for( let c of CM.cuts ){
        //check if this cut is under the mouse
        c.update();

        if ( c.is_mouse_over && DEBUG ){
            let childs = '<br>Child Cuts : <br>';
            for(let x of c.child_cuts){
                childs += x.toString() + '<br>';
            }
            document.getElementById('debug').innerHTML = c.toString() +'<br>Level : ' + c.level.toString() + childs + '<br>' + c.bounded_area.toString();
        }
    }

    for ( let s of CM.syms ){
        s.update();

        if ( s.is_mouse_over && DEBUG ){
            document.getElementById('debug').innerHTML = s.toString() +
                '<br>Level : ' + s.level.toString();
        }
    }

    for ( let c of CM.cuts ){
        drawCut(c);
    }

    for ( let s of CM.syms ){
        drawSymbol(s);
    }

    //we released the mouse and a temporary cut exists, now create it
    if ( !(CM.tmp_cut === null) && !UM.is_mouse_down ){
        CM.addCut(CM.tmp_cut);
    }

    if ( UM.is_mouse_down && UM.is_shift_down && !UM.is_proof_mode){
        drawTemporaryCut(UM.mouse_pos);
    }else{
        CM.tmp_cut = null;
        CM.tmp_origin = null;
    }

    if (UM.current_obj && DEBUG){
        document.getElementById('debug').innerHTML += '<br>Current : ' + UM.current_obj.toString();
    }

    if ( DEBUG ){
        drawDistancesOfCuts();  
    }

    CM.animationRequest = requestAnimationFrame(renderLoop);
}

/** Clear all canvas state and whatever is stored in localstorage */
function clearCanvas(){
    CanvasManager.clearData();
    UserInputManager.clearData();
    localStorage.removeItem('save-state');
}

export {
    clearCanvas,
    DEBUG
};
