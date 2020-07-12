import {CutManager} from './cutmanager.js';
import {Symbolic} from './symbol.js';

/**
* @typedef { import('./cut.js').Cut } Cut 
* @typedef { import('./symbol.js').Symbolic } Symbolic
*/


/** Handles object being drawn on the canvas or mini renderer */

export var CanvasManager = (function(){
    var instance = null;

    function createInstance(canvas, mini_canvas) {
        return new __CANVAS_MANAGER(canvas, mini_canvas);
    }
 
    return {
        clear : function(){
            instance = null;
        },

        init : function(canvas, mini_canvas){
            instance = createInstance(canvas, mini_canvas);
        },

        getInstance: function () {
            if (!instance) {
                throw "Tried to get uninitialized canvas manager, call init first"
            }
            return instance;
        }
    };
})();


class __CANVAS_MANAGER{
    constructor(canvas, mini_canvas){
        this.cuts = [];
        this.syms = [];
        //scratch cuts and syms, used for the mini renderer
        this.s_cuts = [];
        this.s_syms = [];

        this.is_mini_open = false;

        this.Canvas = canvas;
        this.MiniCanvas = mini_canvas;

        this.Context = this.Canvas.getContext("2d");
        this.MiniContext = this.MiniCanvas.getContext("2d");

        this.animationRequest = null;
        this.m_width;
        this.m_height;
        this.c_width;
        this.c_height;

        this.tmp_cut = null;
        this.tmp_origin = null;

        this.proof_selected = [];
    }   

    /**
    * Get the current open context
    *
    * @returns {CanvasRenderingContext2D}
    */
    getContext(){
        return this.is_mini_open ? this.MiniContext : this.Context;
    }

    /**
    * adds a new cut to either cuts or scratch cuts depending if
    * the mini renderer is open
    *
    * @param {Cut} cut
    */
    addCut(cut){
        cut.resetCenter();
        CutManager.getInstance().addObj(cut);

        let tgt = this.is_mini_open ? this.s_cuts : this.cuts;
        //keep the cuts list sorted from biggest area to smallest
        tgt.push(cut);
        tgt.sort((a,b) => (b.area - a.area));
    }

    /**
    * @returns {Cut[]} returns either cuts or s_cuts based on if mini_renderer is open
    */
    getCuts(){
        return this.is_mini_open ? this.s_cuts : this.cuts;
    }
    

    /**
    * @returns {Symbolic[]} returns either cuts or s_cuts based on if mini_renderer is open
    */
    getSyms(){
        return this.is_mini_open ? this.s_syms : this.syms; 
    }


    /**
    * Adds object to the list of proof selected
    *
    * @param {Cut|Symbolic} tgt
    */
    addProofSelected(tgt){
        this.proof_selected.push(tgt);

        if(this.proof_selected.length === 2){
            document.getElementById("dbl-cut-btn").disabled = false;
        }else{
            document.getElementById("dbl-cut-btn").disabled = true;
        }

    }

    /**
    * Remove from the list of proof selected
    * 
    * @param {Cut|Symbolic} tgt
    */
    removeProofSelected(tgt){
        for(let i = 0; i < this.proof_selected.length; i++){
            if ( this.proof_selected[i].id === tgt.id ){
                this.proof_selected.splice(i, 1);
                break;
            }
        }

        if(this.proof_selected.length !== 2){
            document.getElementById("dbl-cut-btn").disabled = true;
        }else{
            document.getElementById("dbl-cut-btn").disabled = false;
        }
    }

    /**
    * get all objects from a root obj
    * if not given a root will select everything from the assertion plane (i.e everything)
    *
    * @param {Cut|Symbolic|null} root
    */ 
    getAllObjects(root = null){
        let ret = [];
        if(root === null){
            return this.cuts.concat(this.syms);
        }


        if(root instanceof Symbolic){
            //symbols have no children
            return [];
        }

        for(let x of root.child_cuts){
            ret.push(x);
            ret.concat(this.getAllObjects(x));
        }

        for(let x of root.child_syms){
            ret.push(x);
        }

        return ret;
    }

}