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

		this.area = Math.PI * this.rad_x * this.rad_y;
		this.cut_border = new CutBorder();

		this.child_cuts = [];
	}


	update(){
		this.is_mouse_over = isMouseOverCut(this);
		this.is_mouse_in = isMouseInCut(this);
		this.is_mouse_in_border = isMouseInBorder(this);
		if ( this.is_mouse_in_border ){
			updateCursor(this);
		}
	}


	updatePos( new_pos ){
		//calculate offset to center
		let v = new Vector(MOUSE_POS, new Point(new_pos.x,new_pos.y) );
		drawVector(v);

		this.x = new_pos.x;
		this.y = new_pos.y;
		this.center = new Point(this.x,this.y);
	}
}


/**
* @param {Cut} cut
*/
function drawCut(cut){
	let border_rad = 5;

	if ( cut.rad_x < border_rad*2 || cut.rad_y < border_rad*2 )
		return;

	CONTEXT.strokeStyle = cut.is_mouse_over ? 'blue' : 'black';
	CONTEXT.lineWidth = cut.border_rad;

	CONTEXT.beginPath();
	CONTEXT.ellipse(cut.x, cut.y, cut.rad_x - cut.border_rad/2, 
					cut.rad_y - cut.border_rad/2, 0, 0, 2 * Math.PI);
	CONTEXT.stroke();
	//now draw inner cut

	CONTEXT.save();
	CONTEXT.globalAlpha = 0.7;
	CONTEXT.fillStyle = cut.is_mouse_over ? '#DCDCDC' : 'white';
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
	return isWithinEllipse(MOUSE_POS, cut.x, cut.y, cut.rad_x , cut.rad_y );
}

/*
*return true if the mouse is inside the cut
*this excludes the border
*@param {Cut} cut
*/
function isMouseInCut(cut){
	return isWithinEllipse(MOUSE_POS, cut.x, cut.y, cut.rad_x - cut.border_rad , cut.rad_y - cut.border_rad);
}

/*
*return true if the mouse is within the border of a cut
*@param {Cut} cut 
*/
function isMouseInBorder(cut){
	return !cut.is_mouse_in && cut.is_mouse_over;
}


function addCut(cut){
	//correct the cuts center position before adding
	resetCenter(cut);
	CUTS.push(cut);
}


function updateCursor(cut){
	//depending on what quardrant we're in, update the cursor 
	//if we're on the border to indicate resizing

	let v = new Vector(MOUSE_POS, cut.center);
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

var TMP_ORIGIN;
function drawTemporaryCut(pos){
	if ( TMP_CUT === null ){
		TMP_ORIGIN = pos;
		TMP_CUT = new Cut(TMP_ORIGIN);
		TMP_CUT.rad_x = 1;
		TMP_CUT.rad_y = 1;
	}

	let v = new Vector(TMP_ORIGIN, pos);
	drawVector(v);

	TMP_CUT.rad_x = Math.abs(v.length);
	TMP_CUT.rad_y = Math.abs(v.height);

	TMP_CUT.x = TMP_ORIGIN.x + v.length/4;
	TMP_CUT.y = TMP_ORIGIN.y + v.height/4;


	CONTEXT.save();
	CONTEXT.globalAlpha = 0.5;
	drawCut(TMP_CUT);
	CONTEXT.restore();
}


function resetCenter(cut){
	cut.center = new Point(cut.x,cut.y);
}