
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


function recalculateChildCuts(){
	for(var i = 0; i < CUTS.length; i++ ){
		CUTS[i].child_cuts = [];
		for(var j = i; j < CUTS.length; j++){
			if ( i === j)
				continue;


			//are there any cuts under i, if so add it to i's children.
			let t = isWithinCut(CUTS[j], CUTS[i]);


			if ( t ){
				CUTS[i].child_cuts.push(CUTS[j]);
				CUTS[j].level = CUTS[i].level + 1;
			}

		}
	}
}