import {CanvasManager} from './canvasManager.js';
import {fixBlur, renderGrid} from './renderer.js';
import {UserInputManager, toggleMode} from './userInput.js';
import {drawTemporaryCut, drawCut} from './cut.js';
import {drawSymbol} from './symbol.js';
import {DEBUG} from './main.js';

function loadMini(){
    let CM = CanvasManager.getInstance();
    CM.is_mini_open = true;

    CM.m_width = CM.MiniCanvas.clientWidth;
    CM.m_height = CM.MiniCanvas.clientHeight;

    fixBlur(CM.MiniCanvas, CM.MiniContext, CM.m_width, CM.m_height);
    renderMiniCanvas();
}


function toggleMiniRenderer(){
    let container = document.getElementById("mini-renderer");
    let UM = UserInputManager.getInstance();
    let CM = CanvasManager.getInstance();

    if(container.style.display != "none"){
        container.style.display = "none";
        cancelAnimationFrame(CM.animationRequest);
        CM.is_mini_open = false;
        toggleMode();
    }else{
        container.style.display = "block";
        toggleMode();
        loadMini();
        CM.is_mini_open = true;
    }

    let btn = document.getElementById("exit-mini");
    btn.style.left = CM.MiniCanvas.offsetLeft + "px";
    btn = document.getElementById("insert-graph");
    btn.style.left = (CM.MiniCanvas.offsetLeft + 60) + "px";
}


//main application loop
function renderMiniCanvas(){
    let CM = CanvasManager.getInstance();
    let UM = UserInputManager.getInstance();

    renderGrid(CM.MiniContext, CM.m_width, CM.m_height, 25);
    UM.update();


    if( DEBUG ){
        document.getElementById("debug").innerHTML = "";
    }

    for( let c of CM.s_cuts ){
        c.update();

        if ( c.is_mouse_over && DEBUG ){
            document.getElementById("debug").innerHTML = c.toString() + 
            "<br>Level : " + c.level.toString();
        }


        if ( c.is_mouse_over ){
            UM.obj_under_mouse = c;
        }

    }

    for ( let s of CM.s_syms ){
        s.update();

        //symSelectionControl(s);

        if ( s.is_mouse_over && DEBUG ){
            document.getElementById("debug").innerHTML = s.toString();
        }


        if ( s.is_mouse_over ){
            UM.obj_under_mouse = s;
        }
    }


    for ( let c of CM.s_cuts ){
        drawCut(c);
    }

    for ( let s of CM.s_syms ){
        drawSymbol(s);
    }

    //we released the mouse and a temporary cut exists, now create it
    if ( !(CM.tmp_cut === null) && !UM.is_mouse_down ){
        addCut(CM.tmp_cut);
    }


    if ( UM.is_mouse_down && UM.is_shift_down && !UM.is_proof_mode ){
        drawTemporaryCut(UM.mouse_pos);
    }else{
        CM.tmp_cut = null;
        CM.tmp_origin = null;
    }

    CM.animationRequest = requestAnimationFrame(renderMiniCanvas);
}


export {
    toggleMiniRenderer
}