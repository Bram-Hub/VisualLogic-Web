import {CanvasManager} from './canvasManager.js';
import {fixBlur, renderGrid, renderDebugInfo} from './renderer.js';
import {UserInputManager, toggleMode} from './userInput.js';
import {drawTemporaryCut} from './cut.js';
import {DEBUG} from './main.js';

function loadMini(){
    let CM = CanvasManager;
    CM.is_mini_open = true;

    CM.m_width = CM.MiniCanvas.clientWidth;
    CM.m_height = CM.MiniCanvas.clientHeight;

    fixBlur(CM.MiniCanvas, CM.MiniContext, CM.m_width, CM.m_height);
    renderMiniCanvas();
}


function toggleMiniRenderer(){
    let container = document.getElementById('mini-renderer');
    let CM = CanvasManager;

    if(container.style.display != 'none'){
        container.style.display = 'none';
        cancelAnimationFrame(CM.animationRequest);
        CM.is_mini_open = false;
        toggleMode();
    }else{
        container.style.display = 'block';
        toggleMode();
        loadMini();
        CM.is_mini_open = true;
    }

    let btn = document.getElementById('exit-mini');
    btn.style.left = CM.MiniCanvas.offsetLeft + 'px';
    btn = document.getElementById('insert-graph');
    btn.style.left = (CM.MiniCanvas.offsetLeft + 60) + 'px';
}


//main application loop
//TODO: reduce duplication between rendering miniCanvas and normal canvas
function renderMiniCanvas(){
    let CM = CanvasManager;
    let UM = UserInputManager;

    renderGrid(CM.MiniContext, CM.m_width, CM.m_height, 25);
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

    if ( UM.is_mouse_down && UM.is_shift_down && !UM.is_proof_mode ){
        drawTemporaryCut(UM.mouse_pos);
    }else{
        CM.tmp_cut = null;
    }

    if( DEBUG ){
        renderDebugInfo();
    }

    CM.animationRequest = requestAnimationFrame(renderMiniCanvas);
}


export {
    toggleMiniRenderer
};
