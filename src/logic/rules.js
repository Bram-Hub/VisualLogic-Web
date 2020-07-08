import {displayMessage} from '../renderer.js';
import {Cut} from '../cut.js';
import {deleteObject} from '../userInput.js';

function doubleCut(elements){
	if(elements.length !== 2){
		displayMessage("Can only double cut with 2 cuts selected");
		return;
	}

	for( let x of elements ){
		if( !(x instanceof Cut) ){
			displayMessage("Can only perform a double cut with cut object");
			return;
		}
	}

	//find the larger cut
	let larger = null;
	let smaller = null;
	if(elements[0].area > elements[1].area){
		larger = elements[0];
		smaller = elements[1];
	}else{
		larger = elements[1];
		smaller = elements[0];
	}

	for(let x of larger.getChildren()){
		if(x.id !== smaller.id){
			displayMessage("Found sub graph between double cut targets");
			return;
		}
	}


	deleteObject(larger);
	deleteObject(smaller);

	displayMessage("Double cut complete");

 }


export{
	doubleCut
}