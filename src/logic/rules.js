import {displaySuccess, displayError} from '../renderer.js';
import {CanvasManager} from '../canvasManager.js';
import {Subgraph} from '../subgraph.js';
import {deleteObject} from '../userInput.js';
import {Cut} from '../cut.js';
import {Symbolic} from '../symbol.js';


/**
* Given two cuts seperated by 1 level, erase both of them
* Similar to a double negation
*
* Performs checks if double check possible
*
* @param {Subgraph} elements - list of objects to try and perform a double cut
*/
function doubleCut(subgraph){
	const elements = subgraph.elements;

	if(elements.length !== 2){
		displayError("Can only double cut between 2 immediate cuts");
		return;
	}

	for( const x of elements ){
		if( !(x instanceof Cut) ){
			displayError("Cannot perform double cut with a Symbol");
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

	for( const x of larger.getChildren()){
		if(x.id !== smaller.id){
			displayError("Found sub graph between double cuts");
			return;
		}
	}


	deleteObject(larger);
	deleteObject(smaller);

	displaySuccess("Double cut complete");

}


/**
* Insertion a subgraph at an odd level
*
* @param {Subgraph} subgraph
*/
function insertion(subgraph){
	let CM = CanvasManager.getInstance();

	//is there enough room
	if(CM.proof_selected.length !== 1){
		displayError("Can only insert into 1 subgraph");
		return;
	}

	let tgt = CM.proof_selected[0];

	if(tgt instanceof Symbolic){
		displayError("Cannot insert into a symbol");
		return;
	}

	//copy over the elements from the mini canvas to the normal canvas
	for(let x of subgraph.elements){
		x = repositonObj(x, tgt);
		if(x instanceof Cut){
			CM.addCut(x);
		}else{
			CM.addSymbol(x);
		}
	}
}


//TODO find better way of doing
function repositonObj(new_obj, tgt){
	new_obj.x = tgt.x;
	new_obj.y = tgt.y;

	return new_obj;
}


/**
* Erasure erase any graph from even level
*
* @param {Subgraph} subgraph
*/

function erasure(subgraph){
	throw 'TODO';
}

export{
	doubleCut,
	insertion
}