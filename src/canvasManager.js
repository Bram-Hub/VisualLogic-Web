import {CutManager} from './cutmanager.js';
import {Symbolic} from './symbol.js';
import {toggleProofButtons} from './userInput.js';
import {Cut, CutBorder} from './cut.js';
import {Point} from './lib/point.js';

/**
* @typedef { import('./cut.js').Cut } Cut 
* @typedef { import('./symbol.js').Symbolic } Symbolic
*/


/** Handles object being drawn on the canvas or mini renderer */

export var CanvasManager = (function(){
    var instance = null;
 
    return {
        /** Delete this singleton instance */
        clear : function(){
            instance = null;
        },
        /** 
        * @param {HTMLCanvasElement} canvas 
        * @param {HTMLCanvasElement} mini_canvas
        */
        init : function(canvas, mini_canvas){
            instance = new __CANVAS_MANAGER(canvas, mini_canvas);
        },

        /** 
         * @returns {__CANVAS_MANAGER} 
         * @throws If canvas manager is not initialized
        */
        getInstance: function () {
            if (!instance) {
                throw 'Tried to get uninitialized canvas manager, call init first';
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
        this.Context = this.Canvas.getContext('2d');
        this.MiniContext = this.MiniCanvas.getContext('2d');
       
        this.animationRequest = null;
        this.m_width;
        this.m_height;
        this.c_width;
        this.c_height;

        this.tmp_cut = null;
        this.tmp_origin = null;

        this.proof_selected = [];
        this.id_map = {};
    }   

    clearData(){
        this.cuts = [];
        this.syms = [];
        this.s_cuts = [];
        this.s_syms = [];
        this.proof_selected = [];
        this.id_map = {};
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
    * Get the current open context
    *
    * @returns {HTMLCanvasElement}
    */
    getCanvas(){
        return this.is_mini_open ? this.MiniCanvas : this.Canvas;
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

        CanvasManager.getInstance().id_map[cut.id] = cut;
    }


    /**
    * adds a new symbolic to either syms or scratch syms depending if
    * the mini renderer is open
    *
    * @param {Symbolic} sym
    */
    addSymbol(sym){
        let tgt = this.is_mini_open ? this.s_syms : this.syms;

        tgt.push(sym);
        CutManager.getInstance().addObj(sym);

        CanvasManager.getInstance().id_map[sym.id] = sym;
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
        toggleProofButtons();
    }

    /**
    * Remove from the list of proof selected
    * 
    * @param {Cut|Symbolic} tgt
    */
    removeProofSelected(tgt){
        const index = this.proof_selected.indexOf(tgt);
        if(index > -1){
            this.proof_selected.splice(index,1);
        }
        toggleProofButtons();
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


/**
* save the application to a tgt destination
*
* @param {String} tgt - can either be "localStorage" | "file" | "string"
*/
function saveState(tgt){
    if(tgt !== 'localStorage' && tgt !== 'file' && tgt !== 'string'){
        return;
    }

    let CM = CanvasManager.getInstance();
    let todo = [];

    for(let x of CM.cuts){
        todo.push( x.serialize() );
    }

    for(let x of CM.syms){
        todo.push( x.serialize() );
    }

    let data = JSON.stringify(todo);

    if(tgt === 'string'){
        return data;
    }else if(tgt === 'localStorage'){
        localStorage.setItem('save-state', data);
    }
}


/**
* load the application from a src destination
*
* @param {String} tgt - can either be "localStorage" | "file" | "string"
* @param {String|null} data - if src is string, data is the string to parse
* @returns {Array} of objects built from save data
*/
function loadState(src, data = null){
    if(src !== 'localStorage' && src !== 'file' && src !== 'string'){
        return;
    }

    let CM = CanvasManager.getInstance();

    if(src === 'localStorage'){
        data = JSON.parse(localStorage.getItem('save-state'));
    }else{
        data = JSON.parse(data);
    }

    let ret = [];
    for(let x of data){
        let tmp = JSON.parse(x);

        if(typeof tmp['border_rad'] === 'number'){
            //cut
            let c = rebuildCut(tmp);
            ret.push(c);
            CM.addCut(c);
        }else{
            //symbolic
            let s = rebuildSymbol(tmp);
            ret.push(s);
            CM.addSymbol(s);
        }
    }

    //once all the cuts have been created swap the ids with the objs
    for(let x of CM.cuts){
        for(let i = 0 ; i < x.child_cuts.length; i++){
            x.child_cuts[i] = CM.id_map[x.child_cuts[i]];
        }

        for(let i = 0 ; i < x.child_syms.length; i++){
            x.child_syms[i] = CM.id_map[x.child_syms[i]];
        }

        if(x.is_proof_selected){
            CM.addProofSelected(x);
        }
    }

    return ret;
}

/**
 * @param {Object} data 
 * @returns {Cut}
 */
function rebuildCut(data){
    let ret = new Cut(new Point(0,0));

    for(let prop in data){
        ret[prop] = data[prop];
    }

    let cb = new CutBorder(null);
    let cb_data = JSON.parse(ret['cut_border']);
    for(let prop in cb_data){
        cb[prop] = cb_data[prop];
    }

    cb.parent = ret;
    ret.cut_border = cb;

    return ret;    
}


/**
 * 
 * @param {Object} data
 * @returns {Symbolic} 
 */
function rebuildSymbol(data){
    let ret = new Symbolic('', new Point(0,0) );

    for(let prop in data){
        ret[prop] = data[prop];
    }

    ret.center = new Point(
        data['center']['x'], 
        data['center']['y']
    );

    return ret;
}


export{
    saveState,
    loadState
};