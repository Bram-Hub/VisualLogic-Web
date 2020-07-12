import {displayMessage} from '../renderer.js';
import {Cut} from '../cut.js';
import {deleteObject} from '../userInput.js';

/**
* Given two cuts seperated by 1 level, erase both of them
* Similar to a double negation
*
* Performs checks if double check possible
*
* @param {Array} elements - list of objects to try and perform a double cut
*/
function doubleCut(elements){
	if(elements.length !== 2){
		displayMessage("Can only double cut with 2 cuts selected");
		return;
	}

	for( let x of elements ){
		if( !(x instanceof Cut) ){
			displayMessage("Can only perform a double cut with a cut");
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


/**
* Insertion a subgraph at an odd level
*/


/**
* Erasure erase any graph from even level
*/

export{
	doubleCut
}