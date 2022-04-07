import {doubleCut, insertion, erasure, deiteration} from './logic/rules.js';
import {getInnerMostCut} from './cut.js';
import {getDeviceRatio, displayError} from './renderer.js';
import {toggleMiniRenderer} from './minirenderer.js';
import {CanvasManager} from './canvasManager.js';
import {transformPoint} from './lib/math.js';
import {clearCanvas} from './main.js';
import {Point} from './lib/point.js';
import {Symbolic} from './symbol.js';

/** Manages the user input state */
class __UserInputManager{
    constructor(){
        const MiniCanvas = CanvasManager.MiniCanvas;
        const CM = CanvasManager;

        CM.Canvas.addEventListener('mousedown', onMouseDown);
        CM.Canvas.addEventListener('mouseup', onMouseUp);
        CM.Canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        MiniCanvas.addEventListener('mousedown', onMouseDown);
        MiniCanvas.addEventListener('mouseup', onMouseUp);
        MiniCanvas.addEventListener('mousemove', onMouseMove);

        this.is_mouse_down = false;
        this.is_shift_down = false;
        this.mouse_pos = new Point(0,0);
        this.last_mouse_pos = this.mouse_pos;
        this.is_proof_mode = false;

        this.current_obj = null;
        this.obj_under_mouse = null;
        this.is_options_menu_open = false;

        this.toggle_mode_btn = document.getElementById('toggle_mode');
        this.insert_btn = document.getElementById('insert-btn');
        this.exit_mini_renderer_btn = document.getElementById('exit-mini');
        this.double_cut_btn = document.getElementById('dbl-cut-btn');
        this.insert_subgraph_btn = document.getElementById('insert-graph');
        this.erasure_btn = document.getElementById('erasure-btn');
        this.iteration_btn = document.getElementById('iteration-btn');
        this.deiteration_btn = document.getElementById('deiteration-btn');
        this.close_btn = document.getElementById('close-btn');
        this.option_btn = document.getElementById('options-btn');
        this.clear_btn = document.getElementById('clear-btn');

        this.toggle_mode_btn.addEventListener('click', toggleMode);
        this.insert_btn.addEventListener('click', toggleMiniRenderer);
        this.exit_mini_renderer_btn.addEventListener('click', toggleMiniRenderer);

        this.modal_background = document.getElementById('modal-background');

        //rules
        this.double_cut_btn.addEventListener('click', () => {
            doubleCut( CanvasManager.proof_selected );
            toggleDoubleCutButton();
        });

        this.insert_subgraph_btn.addEventListener('click', () => {
            toggleMiniRenderer();
            insertion( CanvasManager.s_cuts.concat( CanvasManager.s_syms) );
        });

        this.erasure_btn.addEventListener('click', () => {
            erasure( CanvasManager.proof_selected );
        });

        this.iteration_btn.addEventListener('click', () => { displayError('not implemented'); });
        this.deiteration_btn.addEventListener('click', () => {
            if (deiteration( CM.proof_selected )){
                CM.removeProofSelected(CM.proof_selected[0]);
            }
        });

        this.close_btn.addEventListener('click', toggleOptions);
        this.option_btn.addEventListener('click', toggleOptions);
        this.clear_btn.addEventListener('click', clearCanvas);
    }

    clearData(){
        this.current_obj = null;
        this.obj_under_mouse = null;
        this.is_mouse_down = false;
        this.is_shift_down = false;
        this.is_options_menu_open = false;
        toggleOptions();
    }

    update(){

        if (!this.is_proof_mode){
            if ( this.current_obj !== null ){
                this.current_obj.updatePos( UserInputManager.mouse_pos );
            }
        }

        if ( this.current_obj === null ){
            document.getElementById('canvas').style.cursor = 'default';
        }

        this.obj_under_mouse = getObjUnderMouse();
    }

}


function onMouseMove(e){
    e.preventDefault();
    e.stopPropagation();

    UserInputManager.mouse_pos = getRealMousePos(e);

    //TODO find a better a time to figure this out
    CanvasManager.recalculateCuts();
}


let UserInputManager;

function InitializeUserInputManager(){
    UserInputManager = new __UserInputManager();

    toggleProofButtons();
    toggleOptions();
}


function onMouseDown(e){
    const CM = CanvasManager;
    const UM = UserInputManager;

    UM.last_mouse_pos = getRealMousePos(e);
    UM.is_mouse_down = true;

    if ( UM.is_shift_down && !UM.is_proof_mode ){
        return;
    }

    UM.current_obj = getObjUnderMouse();

    //if CTRL + SHIFT select whatever gets clicked as proof selected
    if (UM.is_shift_down && UM.current_obj !== null){
        if (!UM.current_obj.is_proof_selected){
            CM.addProofSelected(UM.current_obj);
        } else {
            CM.removeProofSelected(UM.current_obj);
        }
    }

}


function getObjUnderMouse(){
    const CM = CanvasManager;
    let ret = null;

    const overSyms = CM.getSyms().filter(sym => sym.is_mouse_over);
    if (overSyms.length > 0){
        ret = overSyms[0];
    } else {
        const overCuts = CM.getCuts().filter(cut => (cut.is_mouse_over || cut.is_mouse_in_border) && cut.level === 0);
        if (overCuts.length > 0){
            const innerMost = getInnerMostCut(overCuts[0]);
            ret = innerMost.is_mouse_in_border ? innerMost.cut_border : innerMost;
        }
    }

    return ret;
}


function onMouseUp(){
    UserInputManager.is_mouse_down = false;
    UserInputManager.current_obj = null;
}


/**
* corrects the raw mouse position to a mouse position relative to the canvas
* upper left corner is (0,0)
*
* also corrects for HiDPI displays since every canvas pixel
* may not map to every pixel on the physical display
*
* @param {Point} pos - raw mouse position
* @returns {Point}
*/
function getRealMousePos(pos){
    return transformPoint(
        new Point(pos.offsetX, pos.offsetY), getDeviceRatio()
    );
}


function onKeyDown(e){
    if ( e.code === 'ShiftLeft' || e.code === 'ShiftRight' ){
        UserInputManager.is_shift_down = true;
    }
}


function onKeyUp(e){
    const UM = UserInputManager;

    const isAlpha = (tgt) => {
        if ( tgt.length != 4 ){
            return false;
        }

        const n = tgt.charCodeAt(3);
        return n >=65 && n <= 90;
    };

    if ( e.code === 'Escape' ) {
        //user decides to not create a cut, clear the temporary
        CanvasManager.tmp_cut = null;
    } else if ( isAlpha(e.code) && e.code != 'KeyR' && !UM.is_proof_mode){     //prevent blocking page refresh
        CanvasManager.addSymbol( new Symbolic(e.code[3], UM.mouse_pos ) );
    } else if ( (e.code === 'Delete' || e.code === 'Backspace') && !UM.is_proof_mode ){
        deleteObjectUnderMouse();
    } else if ( e.code === 'ShiftLeft' || e.code === 'ShiftRight' ){
        UM.is_shift_down = false;
    }

}


/**
* Toggles the different modes in VL, fired by onclick event
*/
function toggleMode(){
    const UM = UserInputManager;
    const CM = CanvasManager;

    if (CM.is_mini_open){
        return;
    }

    UM.is_proof_mode = !UM.is_proof_mode;

    const tgt = document.getElementById('toggle_mode');

    tgt.innerHTML = UM.is_proof_mode ? 'Proof Mode' : 'Transform Mode';
    tgt.className = `btn btn-${UM.is_proof_mode ? 'proof' : 'transform'}`;
    localStorage.setItem('proof_mode', (UM.is_proof_mode ? 'active' : 'inactive') );

    toggleProofPanel();
}


function toggleProofPanel(){
    const tgt = document.getElementById('proof-panel');
    tgt.style.display = UserInputManager.is_proof_mode ? 'block' : 'none';
}


//TODO move somwhere else & remove obj from child cuts
/** @param {Cut|Symbolic} obj */
function deleteObject(obj){
    const CM = CanvasManager;
    function removeFromList(tgt, list){
        for (let i = 0; i < list.length; i++){
            if ( list[i].id === tgt.id ){
                list.splice(i, 1);
                break;
            }
        }
    }

    if ( obj instanceof Symbolic ){
        removeFromList(obj, CM.getSyms());
    } else {
        removeFromList(obj, CM.getCuts());
    }


    for (const x of CM.getCuts()){
        removeFromList(obj, x.child_cuts);
        removeFromList(obj, x.child_syms);
    }


    removeFromList(obj,CM.proof_selected);
}


/**
 * Delete an object and any child objs
 * @param {Cut|Symbolic} obj
 */
function deleteObjectRecursive(obj){
    if (obj instanceof Symbolic){
        deleteObject(obj);
        return;
    }

    const next = obj.getChildren();
    deleteObject(obj);

    next.forEach(child => deleteObjectRecursive(child));
}


function deleteObjectUnderMouse(){
    const UM = UserInputManager;
    if (UM.obj_under_mouse === null){
        return;
    }


    deleteObject(UM.obj_under_mouse);
    UM.current_obj = null;
}


function toggleDoubleCutButton(){
    UserInputManager.double_cut_btn.disabled = CanvasManager.proof_selected.length !== 2;
    UserInputManager.double_cut_btn.blur();
}


function toggleInsertionButton(){
    UserInputManager.insert_btn.disabled = CanvasManager.proof_selected.length !== 1;
    UserInputManager.insert_btn.blur();
}


function toggleErasureButton(){
    UserInputManager.erasure_btn.disabled = CanvasManager.proof_selected.length !== 1;
    UserInputManager.erasure_btn.blur();
}


function toggleDeiterationButton(){
    UserInputManager.deiteration_btn.disabled = CanvasManager.proof_selected.length !== 2;
    UserInputManager.deiteration_btn.blur();
}

function toggleProofButtons(){
    toggleDoubleCutButton();
    toggleInsertionButton();
    toggleErasureButton();
    toggleDeiterationButton();
}

function toggleOptions(){
   UserInputManager.modal_background.style.display = UserInputManager.modal_background.style.display === 'flex' ? 'none' : 'flex';
}

export {
    UserInputManager,
    InitializeUserInputManager,
    toggleMode,
    deleteObject,
    deleteObjectRecursive,
    toggleProofButtons
};
