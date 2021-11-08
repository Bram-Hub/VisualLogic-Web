import {Cut, CutBorder, isWithinCut, getInnerMostCutWithSymbol} from './cut.js';
import {toggleProofButtons} from './userInput.js';
import {Symbolic} from './symbol.js';
import {Point} from './lib/point.js';

/**
* @typedef { import('./cut.js').Cut } Cut 
* @typedef { import('./symbol.js').Symbolic } Symbolic
*/


/** Handles object being drawn on the canvas or mini renderer & the state of the app */
class __CanvasManager{
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

        this.last_id = 0;
    }   

    clearData(){
        this.cuts = [];
        this.syms = [];
        this.s_cuts = [];
        this.s_syms = [];
        this.proof_selected = [];
        this.id_map = {};
        this.last_id = 0;
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

        let tgt = this.is_mini_open ? this.s_cuts : this.cuts;
        //keep the cuts list sorted from biggest area to smallest
        tgt.push(cut);
        tgt.sort((a,b) => (b.area - a.area));

        this.id_map[cut.id] = cut;
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

        this.id_map[sym.id] = sym;
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

    /**
    * save the application to a tgt destination
    * TODO support file downloads
    *
    * @param {String} tgt - can either be "localStorage" | "file" | "string"
    */
    save(tgt = 'localStorage'){
        if(tgt !== 'localStorage' && tgt !== 'file' && tgt !== 'string'){
            return;
        }

        let objs = [];

        this.cuts.forEach(cut => objs.push(cut.serialize()));
        this.syms.forEach(sym => objs.push(sym.serialize()));
    
        const data = JSON.stringify(objs);
    
        if(tgt === 'string'){
            return data;
        }else if(tgt === 'localStorage'){
            localStorage.setItem('save-state', data);
        }
    }

    /**
     * Get a new ID for a symbol or cut
     * @returns {Number}
     */
    getNextId(){
        this.last_id++;
        return this.last_id;
    }

    /**
     * Recalculate cuts by updating which ones are children of which
     * TODO: find better time to calc this from
     * TODO: reduce search space of which Cuts to recalc
     */
    recalculateCuts(){
        let CM = CanvasManager;
        for(let c of CM.getCuts()){
            c.level = 1;
            c.child_syms = [];
            c.child_cuts = [];
        }

        
        for(let i of CM.getCuts()){
            for(let j of CM.getCuts()){
                if ( i.id === j.id ){
                    continue;
                }

                if ( isWithinCut(i,j) || isWithinCut(j,i) ){

                    if ( i.area > j.area ){
                        i.addChildCut(j);
                        j.level = i.level + 1;
                    }
                }

            }


        }


        for(let c of CM.getCuts()){
            //update any symbols
            for(let s of CM.getSyms()){
                if( isWithinCut(s, c) ){
                    //add this to the innermost in this cut
                    s.level = c.level;
                    getInnerMostCutWithSymbol(c, s).addChildSym(s);
                }
            }
        }


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
            CanvasManager.addCut(c);
        }else{
            //symbolic
            let s = rebuildSymbol(tmp);
            ret.push(s);
            CanvasManager.addSymbol(s);
        }
    }

    //once all the cuts have been created swap the ids with the objs
    for(let x of CanvasManager.cuts){
        for(let i = 0 ; i < x.child_cuts.length; i++){
            x.child_cuts[i] = CanvasManager.id_map[x.child_cuts[i]];
        }

        for(let i = 0 ; i < x.child_syms.length; i++){
            x.child_syms[i] = CanvasManager.id_map[x.child_syms[i]];
        }

        if(x.is_proof_selected){
            CanvasManager.addProofSelected(x);
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


var CanvasManager;
/**
 * @param {HTMLCanvasElement} canvas 
 * @param {HTMLCanvasElement} mini_canvas 
 */
function InitializeCanvasManager(canvas, mini_canvas){
    CanvasManager = new __CanvasManager(canvas,mini_canvas);
}


export{
    CanvasManager,
    InitializeCanvasManager,
    loadState
};