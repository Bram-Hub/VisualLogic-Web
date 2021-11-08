import {doubleCut, insertion, erasure} from './logic/rules.js';
import {Cut, CutBorder, mouseOverInnerMost} from './cut.js';
import {getDeviceRatio, displayError} from './renderer.js';
import {toggleMiniRenderer} from './minirenderer.js';
import {CanvasManager} from './canvasManager.js';
import {transformPoint} from './lib/math.js';
import {Subgraph} from './subgraph.js';
import {clearCanvas} from './main.js';
import {Point} from './lib/point.js';
import {Symbolic} from './symbol.js';

/** Manages the user input state */
class __UserInputManager{
    constructor(){
        let MiniCanvas = CanvasManager.MiniCanvas;

        CanvasManager.Canvas.addEventListener('mousedown', onMouseDown);
        CanvasManager.Canvas.addEventListener('mouseup', onMouseUp);
        CanvasManager.Canvas.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        MiniCanvas.addEventListener('mousedown', onMouseDown);
        MiniCanvas.addEventListener('mouseup', onMouseUp);
        MiniCanvas.addEventListener('mousemove', this.onMouseMove);

        this.is_mouse_down = false;
        this.is_shift_down = false;
        this.mouse_pos = new Point(0,0);
        this.last_mouse_pos = this.mouse_pos;
        this.is_proof_mode = false;

        this.current_obj = null;
        this.obj_under_mouse = null;
        this.is_options_menu_open = false;

        document.getElementById('toggle_mode').addEventListener('click', toggleMode);
        document.getElementById('insert-btn').addEventListener('click', toggleMiniRenderer);
        document.getElementById('exit-mini').addEventListener('click', toggleMiniRenderer);
        document.getElementById('dbl-cut-btn').addEventListener('click', () => {
            doubleCut( new Subgraph( CanvasManager.proof_selected) );
            toggleDoubleCutButton();
        });
        document.getElementById('insert-graph').addEventListener('click', () => {
            toggleMiniRenderer();
            insertion( new Subgraph( CanvasManager.s_cuts.concat( CanvasManager.s_syms) ) );
        });
        document.getElementById('erasure-btn').addEventListener('click', () => {
            erasure();
        });
        document.getElementById('iteration-btn').addEventListener('click', () => { displayError('not implemented'); });
        document.getElementById('deiteration-btn').addEventListener('click', () => { displayError('not implemented'); });
        document.getElementById('close-btn').addEventListener('click', toggleOptions);
        document.getElementById('options-btn').addEventListener('click', toggleOptions);
        document.getElementById('clear-btn').addEventListener('click', clearCanvas);
        
        toggleProofButtons();
        toggleOptions();
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
    }

    /** @param {MouseEvent} e */
    onMouseMove(e){
        e.preventDefault();
        e.stopPropagation();

        UserInputManager.mouse_pos = getRealMousePos(e);

        //TODO find a better a time to figure this out
        CanvasManager.recalculateCuts();
    }
}


var UserInputManager;

function InitializeUserInputManager(){
    UserInputManager = new __UserInputManager();
}

/** @param {MouseEvent} e */
function onMouseDown(e){
    let CM = CanvasManager;
    let UM = UserInputManager;

    UM.last_mouse_pos = getRealMousePos(e);
    UM.is_mouse_down = true;

    if ( UM.is_shift_down && !UM.is_proof_mode ){
        return;
    }

    const overSyms = CM.getSyms().filter(sym => sym.is_mouse_over);
    if(overSyms.length > 0){
        UM.current_obj = overSyms[0];
    }
    else{
        const overCuts = CM.getCuts().filter(cut => (cut.is_mouse_over || cut.is_mouse_in_border) && cut.level === 1);
        if(overCuts.length > 0){
            const innerMost = mouseOverInnerMost(overCuts[0]);
            UM.current_obj = innerMost.is_mouse_in_border ? innerMost.cut_border : innerMost;
        }
    }

    //if CTRL + SHIFT select whatever gets clicked as proof selected
    if(UM.is_shift_down && UM.current_obj !== null){
        if(!UM.current_obj.is_proof_selected){
            CM.addProofSelected(UserInputManager.current_obj);
        }else{
            CM.removeProofSelected(UserInputManager.current_obj);
        }
    }

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


/** @param {MouseEvent} e */
function onKeyDown(e){
    if ( e.code === 'ShiftLeft' || e.code === 'ShiftRight' ){
        UserInputManager.is_shift_down = true;
    }
}


/** @param {MouseEvent} e */
function onKeyUp(e){
    let UM = UserInputManager;
    
    let isAlpha = (tgt) => {
        if ( tgt.length != 4 ){
            return false;
        }

        const n = tgt.charCodeAt(3);
        return n >=65 && n <= 90;
    };
    
    if ( e.code === 'Escape' ){
        //user decides to not create a cut, clear the temporary
        CanvasManager.tmp_cut = null;
    }
    
    //prevent blocking page refresh
    else if( isAlpha(e.code) && e.code != 'KeyR' && !UM.is_proof_mode){
        CanvasManager.addSymbol( new Symbolic(e.code[3], UM.mouse_pos ) );
    }
    
    else if( (e.code === 'Delete' || e.code === 'Backspace') && !UM.is_proof_mode ){
        deleteObjectUnderMouse();
    }

    UM.is_shift_down = false;    
}


/**
* Toggles the different modes in VL, fired by onclick event
*/
function toggleMode(){
    let UM = UserInputManager;
    let CM = CanvasManager;

    if(CM.is_mini_open){
        return;
    }

    UM.is_proof_mode = !UM.is_proof_mode;

    let tgt = document.getElementById('toggle_mode');

    tgt.innerHTML = UM.is_proof_mode ? 'Proof Mode' : 'Transform Mode';
    tgt.className = 'btn btn-' + (UM.is_proof_mode ? 'proof' : 'transform');
    localStorage.setItem('proof_mode', (UM.is_proof_mode ? 'active' : 'inactive') );

    toggleProofPanel();
}


function toggleProofPanel(){
    let tgt = document.getElementById('proof-panel');
    tgt.style.display = UserInputManager.is_proof_mode ? 'block' : 'none';
}


//TODO move somwhere else & remove obj from child cuts 
/** @param {Cut|Symbolic} obj */
function deleteObject(obj){
    let CM = CanvasManager;
    function removeFromList(tgt, list){
        for(let i = 0; i < list.length; i++){
            if ( list[i].id === tgt.id ){
                list.splice(i, 1);
                break;
            }
        }
    }

    if( obj instanceof Symbolic ){
        removeFromList(obj, CM.getSyms());
    }else{
        removeFromList(obj, CM.getCuts());
    }


    for(let x of CM.getCuts()){
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
    if(obj instanceof Symbolic){
        deleteObject(obj);
        return;
    }

    const next = obj.getChildren();
    deleteObject(obj);

    next.forEach(child => deleteObjectRecursive(child));
}


function deleteObjectUnderMouse(){
    let UM = UserInputManager;
    if(UM.obj_under_mouse === null){
        return;
    }


    deleteObject(UM.obj_under_mouse);

    UM.obj_under_mouse = null;
}


function toggleDoubleCutButton(){
    document.getElementById('dbl-cut-btn').disabled = CanvasManager.proof_selected.length !== 2;
}


function toggleInsertionButton(){
    document.getElementById('insert-btn').disabled = CanvasManager.proof_selected.length !== 1;
}


function toggleErasureButton(){
    document.getElementById('erasure-btn').disabled =  CanvasManager.proof_selected.length !== 1;
}


function toggleProofButtons(){
    toggleDoubleCutButton();
    toggleInsertionButton();
    toggleErasureButton();
}


function toggleOptions(){
    const tgt = document.getElementById('model-background');
    tgt.style.display = tgt.style.display === 'flex' ? 'none' : 'flex';  
}

export {
    UserInputManager,
    InitializeUserInputManager,
    toggleMode,
    deleteObject,
    deleteObjectRecursive,
    toggleProofButtons
};
