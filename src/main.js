import {CanvasManager, InitializeCanvasManager} from './canvasManager.js';
import {onResize, renderGrid, renderDebugInfo} from './renderer.js';
import {UserInputManager, InitializeUserInputManager, toggleMode} from './userInput.js';
import {drawTemporaryCut} from './cut.js';

const DEBUG = document.getElementById('debug') ? document.getElementById('debug').dataset.debugMode === 'true' : false;

/**
* Entry Point of the program
* Init application and begin main render loop
*/
window.addEventListener('load', init);
function init() {
    //initialize application
    const canvas = document.getElementById('canvas');
    if ( !canvas || !canvas.getContext('2d')){
        alert('Failed to initialized canvas element');
        return;
    }

    const mini_canvas = document.getElementById('mini-canvas');
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
    const mode = localStorage.getItem('proof_mode');
    if (!mode){
        localStorage.setItem('proof_mode', 'active');
    } else if (mode === 'active'){
        toggleMode();
    }

    //load previous data
    if (localStorage.getItem('save-state')){
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
    const CM = CanvasManager;
    const UM = UserInputManager;

    renderGrid(CM.Context, CM.c_width, CM.c_height);
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
    } else {
        CM.tmp_cut = null;
    }


    if ( DEBUG ){
        renderDebugInfo();
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
