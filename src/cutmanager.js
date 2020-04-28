
function drawDistancesOfCuts(){
	
	for (var i = 0; i < CUTS.length; i++ ){
		for( var j = i; j < CUTS.length; j++){
			if ( j == i )
				continue;

			let v = new Vector( CUTS[i].center, CUTS[j].center );
			drawVector(v);

		}

	}

}