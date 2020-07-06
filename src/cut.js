/** @typedef { import('./lib/point.js').Point } Point */

/**
*A cut represents a negation in the sheet of assertion
*/
class Cut{
    /**
    * @constructor 
    * @param {Point} pos the position of the cut
    */
    constructor(pos){
        this.x = pos.x;
        this.y = pos.y;
        this.id = Date.now().toString() + getRandomString();

        this.border_rad = 10;
        this.rad_x = 100 + this.border_rad;
        this.rad_y = 100 + this.border_rad;

        this.is_mouse_over = false;
        this.is_mouse_in = false;
        this.is_mouse_in_border = false;
        this.center = new Point(this.x,this.y);

        this.cut_border = new CutBorder();

        this.child_cuts = [];
        this.child_syms = [];
        this.level = 1;

        this.area = getEllipseArea(this.rad_x, this.rad_y);
    }


    update(){
        let UM = UserInputManager.getInstance();

        this.is_mouse_over = isMouseOverCut(this);
        this.is_mouse_in = isMouseInCut(this);
        this.is_mouse_in_border = isMouseInBorder(this);
        this.area = getEllipseArea(this.rad_x, this.rad_y);

        if ( this.is_mouse_in_border ){
            updateCursor(this);
        }

        if (this.is_mouse_over){
            UM.obj_under_mouse = this;
        }

        for(var x of this.child_cuts){
            if ( x.is_mouse_over ){
                UM.obj_under_mouse = x;
            }
        }

    }


    updatePos( new_pos, root = true ){
        let UM = UserInputManager.getInstance();
        let dx = new_pos.x - UM.last_mouse_pos.x;
        let dy = new_pos.y - UM.last_mouse_pos.y;

        this.x += dx;
        this.y += dy;
        this.center = new Point(this.x,this.y);

        for ( let child of this.child_cuts ){
            if ( child.level === this.level + 1)
                child.updatePos( new_pos, false);
        }

        for ( let child of this.child_syms ){
            if ( child.level === this.level )
                child.updatePos(new_pos, false);
        }


        if ( root ){
            UM.last_mouse_pos = new_pos;
        }
    }


    toString(){
        return this.id;
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
    * adds a new child symbol to this cut, checks if unique
    * @param {Symbol} new_child - sym to add
    */
    addChildSym(new_child){
        if( this.child_syms.includes(new_child) ){
            return;
        }

        this.child_syms.push(new_child);
    }
}


/**
* @param {Cut} cut
*/
function drawCut(cut){
    let CONTEXT = CanvasManager.getInstance().getContext();
    let UM = UserInputManager.getInstance();

    let border_rad = 5;

    if ( cut.rad_x < border_rad*2 || cut.rad_y < border_rad*2 )
        return;

    CONTEXT.strokeStyle = cut === UM.obj_under_mouse ? 'blue' : 'black';
    CONTEXT.lineWidth = cut.border_rad;

    CONTEXT.beginPath();
    CONTEXT.ellipse(cut.x, cut.y, cut.rad_x - cut.border_rad/2, 
                    cut.rad_y - cut.border_rad/2, 0, 0, 2 * Math.PI);
    CONTEXT.stroke();
    //now draw inner cut

    inner_style = cut.level % 2 == 0 ? "white" : "#A9A9A9";

    CONTEXT.save();
    CONTEXT.globalAlpha = 0.7;
    CONTEXT.fillStyle = cut === UM.obj_under_mouse ? '#DCDCDC' : inner_style;
    CONTEXT.beginPath();
    CONTEXT.ellipse(cut.x, cut.y, 
                    cut.rad_x - cut.border_rad, 
                    cut.rad_y - cut.border_rad, 0, 0, 2 * Math.PI);

    CONTEXT.fill();
    CONTEXT.restore();
    CONTEXT.lineWidth = 1;
}

class CutBorder{
    updatePos(){
        //TODO
    }
}

/**
* return true if the mouse is over any point in the cut
* this includes the border
* @param {Cut} cut
*/
function isMouseOverCut(cut){
    return isWithinEllipse(
        UserInputManager.getInstance().mouse_pos, 
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
        UserInputManager.getInstance().mouse_pos,  
        cut.x, cut.y, 
        cut.rad_x - cut.border_rad , 
        cut.rad_y - cut.border_rad
    );
}

/**
* return true if the mouse is within the border of a cut
* @param {Cut} cut 
*/
function isMouseInBorder(cut){
    return !cut.is_mouse_in && cut.is_mouse_over;
}


function updateCursor(cut){
    //depending on what quardrant we're in, update the cursor 
    //if we're on the border to indicate resizing

    let v = new Vector(UserInputManager.getInstance().mouse_pos, cut.center);
    let a = v.angle_degrees;

    let ptr = "pointer";
    if( isWithinTollerance(a,270,10) || isWithinTollerance(a,90,20) ){
        ptr = "ns-resize";
    }else if( (a > 110 && a < 170) || (a > 290 && a < 340) ){
        ptr = "nesw-resize";
    }else if( isWithinTollerance(a, 180, 20) || isWithinTollerance(a,360,20) || a < 20){
        ptr = "ew-resize";
    }else if( (a > 200 && a < 250) || (a > 20 && a < 70) ){
        ptr = "nwse-resize";
    }else{
        ptr = "default";
    }

    document.getElementById("canvas").style.cursor = ptr; 
}

function drawTemporaryCut(pos){
    let CM = CanvasManager.getInstance();
    if ( CM.tmp_cut === null ){
        CM.tmp_origin = pos;
        CM.tmp_cut = new Cut(CM.tmp_origin);
        CM.tmp_cut.rad_x = 1;
        CM.tmp_cut.rad_y = 1;
    }

    let v = new Vector(CM.tmp_origin, pos);

    if ( DEBUG ){
        drawVector(v);
    }

    CM.tmp_cut.rad_x = Math.abs(v.length);
    CM.tmp_cut.rad_y = Math.abs(v.height);

    CM.tmp_cut.x = CM.tmp_origin.x + v.length/4;
    CM.tmp_cut.y = CM.tmp_origin.y + v.height/4;

    let context = CM.getContext();

    context.save();
    context.globalAlpha = 0.5;
    drawCut(CM.tmp_cut);
    context.restore();
}


function resetCenter(cut){
    cut.center = new Point(cut.x,cut.y);
}


/**
* check if an object within a cut
* 
* @param {Cut|Symbol} a
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
    inner_most = null;
    for (let x of cut.child_cuts ){
        if ( x.is_mouse_over ){
            inner_most = x;
        }
    }

    return inner_most === null ? cut : inner_most;
}


/**
* Given a symbol & root cut find the innermost cut 
* we can place that symbol under
*
* @param {Cut} cut
* @param {Symbol} sym
* @returns {Cut}
*/
function getInnerMostCutWithSymbol(cut, sym){
    inner_most = null;

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
