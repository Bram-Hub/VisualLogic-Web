
class Vector{
	constructor(s,t){
		this.start = s;
		this.end = t;

		this.r = getDistance(this.start, this.end);
		this.length = this.end.x - this.start.x;
		this.height = this.end.y - this.start.y;
		this.angle = Math.atan2(this.height,this.length);
		if (this.angle < 0){
			this.angle = (2 * Math.PI) + this.angle;
		}

		this.angle_degrees = this.angle * (180/Math.PI) ;

		this.left_to_right = this.length >= 0; 
		this.top_to_bot = this.height >= 0;
	}
}