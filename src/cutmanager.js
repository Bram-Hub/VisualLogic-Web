
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
	for(let c of CUTS){
		c.level = 1;
		c.child_syms = [];
		c.child_cuts = [];
	}

	for(let i = 0; i < CUTS.length; i++ ){
		for(let j = i; j < CUTS.length; j++){
			if ( i === j)
				continue;


			//are there any cuts under i, if so add it to i's children.
			let t = isWithinCut(CUTS[j], CUTS[i]);


			if ( t ){
				CUTS[i].child_cuts.push(CUTS[j]);
				CUTS[j].level = CUTS[i].level + 1;
			}

		}

		//do the same for symbols
		for (let k = 0; k < SYMBOLS.length; k++){
			let t = isWithinCut(SYMBOLS[k], CUTS[i]);

			if ( t ){
				CUTS[i].child_syms.push(SYMBOLS[k]);
			}

		}

	}
}