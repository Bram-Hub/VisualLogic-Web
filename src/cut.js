import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {DEBUG} from './main.js';
import {Point} from './lib/point.js';
import {
    getEllipseArea, 
    isWithinEllipse, 
    isWithinTollerance,
    getInteriorBoundingBox,
} from './lib/math.js';
import {Vector} from './lib/vector.js';
import {renderProofTexture} from './renderer.js';


/**
* A cut represents a negation in the sheet of assertion
*/
class Cut{
    /**
    * @constructor 
    * @param {Point} pos the position of the cut
    */
    constructor(pos){
        this.x = pos.x;
        this.y = pos.y;
        this.id = CanvasManager.getNextId();

        this.border_rad = 10;
        this.rad_x = 100 + this.border_rad;
        this.rad_y = 100 + this.border_rad;

        this.is_mouse_over = false;
        this.is_mouse_in_border = false;
        this.center = new Point(this.x,this.y);

        this.cut_border = new CutBorder(this);

        this.child_cuts = [];
        this.child_syms = [];
        this.level = 1;

        this.area = getEllipseArea(this.rad_x, this.rad_y);

        this.is_proof_selected = false;
        this.bounding_box = [
            this.x - this.rad_x, 
            this.y - this.rad_y,
            this.rad_x*2,this.rad_y*2
        ];

        this.bounded_area = this.bounding_box[2] * this.bounding_box[3];

        let inner_bb = getInteriorBoundingBox(this.rad_x, this.rad_y);
        let diff_x = (this.rad_x * 2) - (inner_bb[0] * 2);
        let diff_y = (this.rad_y * 2) - (inner_bb[1] * 2);

        this.interier_bounding_box = [
            this.x - this.rad_x + diff_x/2, 
            this.y - this.rad_y + diff_y/2,
            inner_bb[0]*2,inner_bb[1]*2
        ];
    }


    update(){
        let UM = UserInputManager;

        this.is_mouse_in_border = isMouseInBorder(this);
        this.is_mouse_over = UM.is_proof_mode ? isMouseOverCut(this) : isMouseInCut(this) ;
        this.area = getEllipseArea(this.rad_x, this.rad_y);

        if ( this.is_mouse_in_border && !UM.is_proof_mode ){
            updateCursor(this);
        }

        if (this.is_mouse_over){
            UM.obj_under_mouse = this;
        }

        this.bounding_box = [
            this.x - this.rad_x, 
            this.y - this.rad_y,
            this.rad_x*2,this.rad_y*2
        ];

        this.bounded_area = this.bounding_box[2] * this.bounding_box[3];

        let inner_bb = getInteriorBoundingBox(this.rad_x, this.rad_y);
        let diff_x = (this.rad_x * 2) - (inner_bb[0] * 2);
        let diff_y = (this.rad_y * 2) - (inner_bb[1] * 2);

        this.interier_bounding_box = [
            this.x - this.rad_x + diff_x/2, 
            this.y - this.rad_y + diff_y/2,
            inner_bb[0]*2,inner_bb[1]*2
        ];
    }


    /**
    * update this cut and its child cuts & syms
    * 
    * @param {Point} new_pos - the new position to move to
    * @param {Boolean|null} root - is this the root obj to move or false if getting moved by another
    */
    updatePos( new_pos, root = true ){
        let UM = UserInputManager;
        let dx = new_pos.x - UM.last_mouse_pos.x;
        let dy = new_pos.y - UM.last_mouse_pos.y;

        this.x += dx;
        this.y += dy;
        this.center = new Point(this.x,this.y);

        for ( let child of this.child_cuts ){
            if ( child.level === this.level + 1){
                child.updatePos( new_pos, false);
            }
        }

        for ( let child of this.child_syms ){
            if ( child.level === this.level ){
                child.updatePos(new_pos, false);
            }
        }


        if ( root ){
            UM.last_mouse_pos = new_pos;
        }
    }


    toString(){
        return this.id.toString();
    }


    /**
    * adds a new child cut to this cut, checks if unique
    * @param {Cut} new_child - cut to add
    */
    addChildCut(new_child){
        if( this.child_cuts.includes(new_child) ){
            return;
        }

        this.child_cuts.push(new_child);
    }


    /**
    * adds a new child symbolic to this cut, checks if unique
    * @param {Symbolic} new_child - sym to add
    */
    addChildSym(new_child){
        if( this.child_syms.includes(new_child) ){
            return;
        }

        this.child_syms.push(new_child);
    }

    resetCenter(){
        this.center = new Point(this.x,this.y);
    }


    /**
    * Gets children that are only 1 level distant from this cut
    * ignores nested child objects, result can include cuts or symbolics
    *
    * @returns {Array}
    */
    getChildren(){
        return this.child_cuts.filter(cut => cut.level === this.level+1).concat(
            this.child_syms.filter(sym => sym.level === this.level));
    }


    serialize(){
        function replacer(key, value){
            if(key === 'cut_border'){
                return value.serialize();
            }else if(key === 'child_syms' || key === 'child_cuts'){
                let r = [];
                value.forEach(val => r.push(val.id));
                return r;
            }else{
                return value;
            }
        }

        return JSON.stringify(this, replacer);
    }


    draw(){
        let context = CanvasManager.getContext();
        let UM = UserInputManager;
    
        let border_rad = 5;
    
        if ( this.rad_x < border_rad*2 || this.rad_y < border_rad*2 ){
            return;
        }
    
        context.strokeStyle = this === UM.obj_under_mouse ? 'blue' : 'black';
    
        if(this.is_mouse_in_border && !UM.is_proof_mode){
            context.strokeStyle = 'lightblue';
        }
    
        context.lineWidth = this.border_rad;
    
        context.beginPath();
        context.ellipse(
            this.x, this.y, 
            this.rad_x - this.border_rad/2, 
            this.rad_y - this.border_rad/2, 
            0, 0, 2 * Math.PI
        );
    
        context.stroke();
    
        if(DEBUG){
            context.beginPath();
            context.lineWidth = 2;
            let bb = this.bounding_box;
            context.rect(
                bb[0],bb[1],bb[2],bb[3]
            );
    
            let i_bb = this.interier_bounding_box;
            // console.log(bb);
            context.rect(
                i_bb[0],i_bb[1],i_bb[2],i_bb[3]
            );
            context.stroke();
        }
    
    
        //now draw inner cut
    
        let inner_style = '#A9A9A9';
    
        if(this.level % 2 === 0){
            inner_style = 'white';
        }
    
        if(this === UM.obj_under_mouse){
            inner_style = '#DCDCDC';
        }
    
        if(this.is_proof_selected && UM.is_proof_mode){
            inner_style = renderProofTexture(inner_style);
        }
    
        context.save();
        context.globalAlpha = 0.7;
        context.fillStyle = inner_style;
        context.beginPath();
        context.ellipse(
            this.x, this.y, 
            this.rad_x - this.border_rad, 
            this.rad_y - this.border_rad, 0, 0, 2 * Math.PI
        );
    
        context.fill();
        context.restore();
        context.lineWidth = 1;
    }
    
}


/**
 * CutBorder represents the ring around a cut and is used for resizing a cut
 */
class CutBorder{
    constructor(par){
        this.parent = par;
        this.id = CanvasManager.getNextId();

        this.scale_speed = 1;
    }

    update(){
        //pass
    }

    updatePos(new_pos){
        let UM = UserInputManager;
        let dx = (new_pos.x - UM.last_mouse_pos.x) * this.scale_speed;
        let dy = (new_pos.y - UM.last_mouse_pos.y) * this.scale_speed;
        let c = this.parent;

        if( new_pos.leftOf(c.center) ){
            dx = -dx;
        }

        if( new_pos.above(c.center) ){
            dy = -dy;
        }

        this.parent.rad_x += dx;
        this.parent.rad_y += dy;


        this.center = new Point(this.x,this.y);

        UM.last_mouse_pos = new_pos;
    }

    toString(){
        return this.id.toString();
    }

    serialize(){
        function replacer(key,value){
            if(key === 'parent'){
                return value.id;
            }else{
                return value;
            }
        }
        return JSON.stringify(this, replacer);
    }
}


/**
* return true if the mouse is over any point in the cut
* this includes the border
* @param {Cut} cut
*/
function isMouseOverCut(cut){
    return isWithinEllipse(
        UserInputManager.mouse_pos, 
        cut.x, cut.y, cut.rad_x , cut.rad_y 
    );
}


/**
* return true if the mouse is inside the cut
* this excludes the border
* @param {Cut} cut
*/
function isMouseInCut(cut){
    return isWithinEllipse(
        UserInputManager.mouse_pos,  
        cut.x, cut.y, 
        cut.rad_x - cut.border_rad , 
        cut.rad_y - cut.border_rad
    );
}


/**
* return true if the mouse is only within the border of a cut
* @param {Cut} cut 
*/
function isMouseInBorder(cut){
    return !isMouseInCut(cut) && isMouseOverCut(cut);
}


/** 
 * Depending on the mouse position on the cut border select a cursor to indicate what direction to scale towards
 * 
 * @param {Cut} cut 
 */
function updateCursor(cut){
    const a = new Vector(UserInputManager.mouse_pos, cut.center).angle_degrees;

    let ptr = 'default';

    if( isWithinTollerance(a,270,10) || isWithinTollerance(a,90,20) ){
        ptr = 'ns-resize';
    }else if( (a > 110 && a < 170) || (a > 290 && a < 340) ){
        ptr = 'nesw-resize';
    }else if( isWithinTollerance(a, 180, 20) || isWithinTollerance(a,360,20) || a < 20){
        ptr = 'ew-resize';
    }else if( (a > 200 && a < 250) || (a > 20 && a < 70) ){
        ptr = 'nwse-resize';
    }

    document.getElementById('canvas').style.cursor = ptr; 
}

/**
 * draw a temporay cut to the user to visualize where it will be craeted
 * 
 * @param {Point} pos 
 */
function drawTemporaryCut(pos){
    let CM = CanvasManager;
    if ( CM.tmp_cut === null ){
        CM.tmp_cut = new Cut(pos);
    }

    const origin = CM.tmp_cut.center;
    const v = new Vector(origin, pos);

    if ( DEBUG ){
        v.drawVector();
    }

    CM.tmp_cut.rad_x = Math.abs(v.length);
    CM.tmp_cut.rad_y = Math.abs(v.height);

    CM.tmp_cut.x = origin.x + v.length/4;
    CM.tmp_cut.y = origin.y + v.height/4;

    let context = CM.getContext();

    context.save();
    context.globalAlpha = 0.5;
    CM.tmp_cut.draw();
    context.restore();

    CM.tmp_cut.update();
}


/**
* check if an object within a cut
* 
* @param {Cut|Symbolic} a
* @param {Cut}
* @returns {Boolean}
*/
function isWithinCut(a,b){
    return isWithinEllipse(
        a.center, 
        
        b.center.x,
        b.center.y,
        b.rad_x,
        b.rad_y
    );
}


/**
* Gets the innermost cut thats being mouse'd over
* @param {Cut} cut
* @returns {Cut}
*/
function getInnerMostCut(cut){
    let inner_most = null;
    for (let x of cut.child_cuts ){
        if ( x.is_mouse_over || x.is_mouse_in_border ){
            inner_most = getInnerMostCut(x);
        }
    }

    return inner_most === null ? cut : inner_most;
}


/**
* Given a symbolic & root cut find the innermost cut 
* we can place that symbolic under
*
* @param {Cut} cut
* @param {Symbolic} sym
* @returns {Cut}
*/
function getInnerMostCutWithSymbol(cut, sym){
    let inner_most = null;

    for(let x of cut.child_cuts){
        if( isWithinCut(sym, x) ){
            inner_most = getInnerMostCutWithSymbol(x, sym);
        }
    }

    return inner_most === null ? cut : inner_most;
}


/**
* @param {Cut} cut
* @returns {Cut}
*/
function mouseOverInnerMost(cut){
    return getInnerMostCut(cut);
}


export{
    drawTemporaryCut,
    Cut,
    mouseOverInnerMost,
    isWithinCut,
    getInnerMostCutWithSymbol,
    CutBorder,
    getInnerMostCut
};
