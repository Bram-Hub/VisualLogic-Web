import {CanvasManager} from './canvasManager.js';
import {UserInputManager} from './userInput.js';
import {DEBUG} from './main.js';
import {Point} from './lib/point.js';
import {
    getEllipseArea,
    isWithinEllipse,
    getInteriorBoundingBox,
} from './lib/math.js';
import {Vector} from './lib/vector.js';
import {renderProofTexture} from './renderer.js';
import {CutBorder} from './cutBorder.js';

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

        this.cut_border = new CutBorder(this);

        this.child_cuts = [];
        this.child_syms = [];
        this.level = 0;

        this.area = getEllipseArea(this.rad_x, this.rad_y);

        this.is_proof_selected = false;
        this.recalculateBoundingBox();
        
    }


    isEvenLevel(){
        return (this.level % 2) === 0;
    }


    center(){
        return new Point(this.x,this.y);
    }


    recalculateBoundingBox(){
        this.bounding_box = [
            this.x - this.rad_x,
            this.y - this.rad_y,
            this.rad_x*2,this.rad_y*2
        ];

        const inner_bb = getInteriorBoundingBox(this.rad_x, this.rad_y);
        const diff_x = (this.rad_x * 2) - (inner_bb[0] * 2);
        const diff_y = (this.rad_y * 2) - (inner_bb[1] * 2);

        this.interier_bounding_box = [
            this.x - this.rad_x + diff_x/2,
            this.y - this.rad_y + diff_y/2,
            inner_bb[0]*2,
            inner_bb[1]*2
        ];
    }


    update(){
        const UM = UserInputManager;

        this.is_mouse_in_border = isMouseInBorder(this);
        this.is_mouse_over = UM.is_proof_mode ? isMouseOverCut(this) : isMouseInCut(this) ;
        this.area = getEllipseArea(this.rad_x, this.rad_y);

        if ( this.is_mouse_in_border && !UM.is_proof_mode ){
            updateCursor(this);
        }

        this.recalculateBoundingBox();
    }


    /**
    * update this cut and its child cuts & syms
    *
    * @param {Point} new_pos - the new position to move to
    * @param {Boolean|null} root - is this the root obj to move or false if getting moved by another
    */
    updatePos( new_pos, root = true ){
        const UM = UserInputManager;
        const dx = new_pos.x - UM.last_mouse_pos.x;
        const dy = new_pos.y - UM.last_mouse_pos.y;

        this.x += dx;
        this.y += dy;

        for ( const child of this.child_cuts ){
            if ( child.level === this.level + 1){
                child.updatePos( new_pos, false);
            }
        }

        for ( const child of this.child_syms ){
            if ( child.level === this.level + 1){
                child.updatePos(new_pos, false);
            }
        }


        if ( root ){
            UM.last_mouse_pos = new_pos;
        }
    }


    /**
     * Manually set this cut's position and update all children
     */ 
    updateAbsolutePos(new_pos){
        this.x = new_pos.x;
        this.y = new_pos.y;


        for ( const child of this.child_cuts ){
            if ( child.level === this.level + 1){

                let offset_x = child.x - this.x;
                let offset_y = child.y - this.y;

                child.updateAbsolutePos( new Point( new_pos.x + offset_x, new_pos.y + offset_y  )  );
            }
        }

        for ( const child of this.child_syms ){
            if ( child.level === this.level + 1){
                let offset_x = child.x - this.x;
                let offset_y = child.y - this.y;

                console.log(offset_x,offset_y);

                child.updateAbsolutePos( new Point( new_pos.x + offset_x, new_pos.y + offset_y  )  );
            }
        }
    }


    toString(){
        return this.id.toString();
    }


    /**
    * adds a new child cut to this cut
    * @param {Cut} new_child - cut to add
    */
    addChildCut(new_child){
        this.child_cuts.push(new_child);
    }


    /**
    * adds a new child symbolic to this cut
    * @param {Symbolic} new_child - sym to add
    */
    addChildSym(new_child){
        this.child_syms.push(new_child);
    }


    /**
    * Gets children that are only 1 level distant from this cut
    * ignores nested child objects, result can include cuts or symbolics
    *
    * @returns {Array}
    */
    getChildren(){
        return this.child_cuts.filter(cut => cut.level === this.level+1).concat(
            this.child_syms.filter(sym => sym.level === this.level+1));
    }


    serialize(){
        function replacer(key, value){
            if (key === 'cut_border'){
                return value.serialize();
            } else if (key === 'child_syms' || key === 'child_cuts'){
                return value.map(val => val.id);
            } else {
                return value;
            }
        }

        return JSON.stringify(this, replacer);
    }


    draw(){
        const context = CanvasManager.getContext();
        const UM = UserInputManager;

        const border_rad = 5;

        if ( this.rad_x < border_rad*2 || this.rad_y < border_rad*2 ){
            return;
        }

        context.strokeStyle = this === UM.obj_under_mouse ? 'blue' : 'black';
        if (this.is_mouse_in_border && !UM.is_proof_mode){
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

        if (DEBUG){
            context.beginPath();
            context.lineWidth = 2;
            const bb = this.bounding_box;
            context.rect(
                bb[0],bb[1],bb[2],bb[3]
            );

            const i_bb = this.interier_bounding_box;
            context.rect(
                i_bb[0],i_bb[1],i_bb[2],i_bb[3]
            );
            context.stroke();
        }


        //now draw inner cut

        let inner_style = 'rgba(154, 154, 154, 0.7)';

        if (!this.isEvenLevel()){
            inner_style = "rgba(255, 255, 255, 0.7)";
        }

        if (this.is_mouse_over){
            inner_style = 'rgba(220, 220, 220, 0.7)';
        }

        if (UM.is_proof_mode && this.is_proof_selected ){
            inner_style = renderProofTexture(inner_style);
        }

        //context.save();
        //context.globalAlpha = 0.7;
        context.fillStyle = inner_style;
        context.beginPath();
        context.ellipse(
            this.x, this.y,
            this.rad_x - this.border_rad,
            this.rad_y - this.border_rad, 0, 0, 2 * Math.PI
        );

        context.fill();
        //context.restore();
        context.lineWidth = 1;
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
    let angle = new Vector(cut.center(),UserInputManager.mouse_pos).angle_degrees;

    //convert to cartesian angle, based on center of cut
    angle += 90;
    if (angle < 0){
        angle += 360;
    }

    let ptr = 'default';

    if ((angle >= 350 || angle <= 10) ||  (angle <= 190 && angle >= 170) ){
        ptr = 'ns-resize';
    } else if ((angle > 200 && angle < 260) || (angle > 10 && angle < 80 )){
        ptr = 'nesw-resize';
    } else if ((angle >= 260 && angle <= 280) || (angle >= 80 && angle <= 100)){
        ptr = 'ew-resize';
    } else if ((angle > 280 && angle < 350) || (angle > 100 && angle < 170)){
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
    const CM = CanvasManager;
    const UM = UserInputManager;

    if ( CM.tmp_cut === null ){
        CM.tmp_cut = new Cut(pos);
    }

    const origin = UM.last_mouse_pos;
    const v = new Vector(origin, pos);

    if ( DEBUG ){
        v.drawVector();
    }

    const scale = 0.5;

    CM.tmp_cut.rad_x = Math.abs(v.length) * scale;
    CM.tmp_cut.rad_y = Math.abs(v.height) * scale;

    //start a little to the left and above the starting position for a bit of padding
    const x_offset = -10;
    const y_offset = -10;

    CM.tmp_cut.x = (origin.x + x_offset) + (v.length * scale);
    CM.tmp_cut.y = (origin.y + y_offset) + (v.height * scale);

    const context = CM.getContext();

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
        a.center(),

        b.x,
        b.y,
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
    for (const x of cut.child_cuts ){
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

    for (const x of cut.child_cuts){
        if ( isWithinCut(sym, x) ){
            inner_most = getInnerMostCutWithSymbol(x, sym);
        }
    }

    return inner_most === null ? cut : inner_most;
}


export {
    drawTemporaryCut,
    Cut,
    isWithinCut,
    getInnerMostCutWithSymbol,
    getInnerMostCut
};
