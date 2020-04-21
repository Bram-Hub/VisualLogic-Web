class Point{
	constructor(x_,y_){
		this.x = x_;
		this.y = y_;
	}


	update(x_,y_){
		this.x = x_;
		this.y = y_;
	}	
}

function getDistance(p1,p2){
	let a = Math.pow( p2.x - p1.x,2 );
	let b = Math.pow( p2.y - p1.y,2 );

	return Math.sqrt( a + b );
}