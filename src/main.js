import {CanvasManager, InitializeCanvasManager} from './canvasManager.js';
import {onResize, renderGrid, drawDistancesOfCuts, renderDebugInfo} from './renderer.js';
import {UserInputManager, InitializeUserInputManager, toggleMode} from './userInput.js';
import {drawTemporaryCut} from './cut.js';

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
    if(!mode){
        localStorage.setItem('proof_mode', 'active');
    }else if(mode === 'active'){
        toggleMode();
    }

    //load previous data
    if(localStorage.getItem('save-state')){
        CanvasManager.loadState('localStorage');
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

    CM.getCuts().forEach(cut => {
        cut.update();
        cut.draw();
    });

    CM.getSyms().forEach(sym => {
        sym.update();
        sym.draw();
    });

    //we released the mouse and a temporary cut exists, now create it
    if ( !(CM.tmp_cut === null) && !UM.is_mouse_down ){
        CM.addCut(CM.tmp_cut);
    }

    if ( UM.is_mouse_down && UM.is_shift_down && !UM.is_proof_mode){
        drawTemporaryCut(UM.mouse_pos);
    }else{
        CM.tmp_cut = null;
    }


    if( DEBUG ){
        document.getElementById('debug').innerHTML = '';
        renderDebugInfo();
        drawDistancesOfCuts();
        if (UM.current_obj){
            document.getElementById('debug').innerHTML += '<br>Current : ' + UM.current_obj.toString();
        }
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
