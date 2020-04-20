class Cut{
	constructor(x_,y_){
		this.x = x_;
		this.y = y_;
		this.id = Date.now().toString() + getRandomString();


		this.border_rad = 5;
		this.rad_x = 100 + this.border_rad;
		this.rad_y = 100 + this.border_rad;

		this.is_mouse_over = false;
	}

	update(){
		this.is_mouse_over = isMouseOverCut(this);
		if ( this.is_mouse_over ){
			this.border_rad = 10;
		}else{
			this.border_rad = 5;
		}
	}

}

function drawCut(cut){
	let border_rad = 5;

	CONTEXT.fillStyle = 'black';
	CONTEXT.beginPath();
	CONTEXT.ellipse(cut.x, cut.y, cut.rad_x, 
		            cut.rad_y, 0, 0, 2 * Math.PI);

	CONTEXT.fill();
	//now draw inner cut
	CONTEXT.fillStyle = 'white';
	CONTEXT.beginPath();
	CONTEXT.ellipse(cut.x, cut.y, 
		            cut.rad_x - cut.border_rad, 
		            cut.rad_y - cut.border_rad, 0, 0, 2 * Math.PI);
	CONTEXT.fill();
}

//return true if the mouse is over any point in the cut
//this includes the border
function isMouseOverCut(cut){
	let m_x = MOUSE_POS.x;
	let m_y = MOUSE_POS.y;

	let a = Math.pow( m_x - cut.x, 2)/ Math.pow(cut.rad_x, 2);
	let b = Math.pow( m_y - cut.y, 2)/ Math.pow(cut.rad_y, 2);

	return a+b <= 1;
}

//return true if the mouse is inside the cut
//this excludes the border
function isMouseInCut(cut){
	let m_x = MOUSE_POS.x;
	let m_y = MOUSE_POS.y;

	let a = Math.pow( m_x - cut.x, 2)/ Math.pow(cut.rad_x - cut.border_rad, 2);
	let b = Math.pow( m_y - cut.y, 2)/ Math.pow(cut.rad_y - cut.border_rad, 2);

	return a+b <= 1;
}

//return true if the mouse is within the border of a cut
function isMouseInBorder(cut){
	return !isMouseInCut(cut) && isMouseOverCut(cut);
}