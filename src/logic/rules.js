import {displaySuccess, displayError} from '../renderer.js';
import {CanvasManager} from '../canvasManager.js';
import {deleteObject} from '../userInput.js';
import {Cut} from '../cut.js';
import {Symbolic} from '../symbol.js';
import {Point} from '../lib/point.js';
import {UserInputManager} from '../userInput.js';

/** @typedef { import('../subgraph.js').Subgraph } Subgraph */

/**
* Given two cuts seperated by 1 level, erase both of them
* Similar to a double negation
*
* Performs checks if double check possible
*
* @param {Subgraph} subgraph - list of objects to try and perform a double cut
*/
function doubleCut(subgraph){
    const elements = subgraph.elements;

    if(elements.length !== 2){
        displayError('Can only double cut between 2 immediate cuts');
        return;
    }

    for( const x of elements ){
        if( !(x instanceof Cut) ){
            displayError('Cannot perform double cut with a Symbol');
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
            displayError('Found sub graph between double cuts');
            return;
        }
    }


    deleteObject(larger);
    deleteObject(smaller);

    displaySuccess('Double cut complete');

}


/**
* Insertion a subgraph at an odd level
*
* @param {Subgraph} subgraph
*
* TODO: get current elements in tgt graph level and recalculate the subgraph with them
*/
function insertion(subgraph){
    let CM = CanvasManager.getInstance();

    //is there enough room
    if(CM.proof_selected.length !== 1){
        displayError('Can only insert into 1 subgraph');
        return;
    }

    let tgt = CM.proof_selected[0];

    if(tgt instanceof Symbolic){
        displayError('Cannot insert into a symbol');
        return;
    }

    if(tgt.bounded_area <= subgraph.getBoundedArea()){
        //scale the entire graph outwards
    }

    let start_x = tgt.interier_bounding_box[0];
    let start_y = tgt.interier_bounding_box[1];
    let UM = UserInputManager.getInstance();

    //copy over the elements from the subgraph into the real canvas
    for(let x of subgraph.elements){
        if(x instanceof Cut){
            CM.addCut(x);
        }else{
            CM.addSymbol(x);
        }
    }

    //reposition to fit the graph
    //TODO: calculate bounding box correctly, consider leftmost offset of the interior bounding box
    //move the logic of calculating next free space into math.js
    for(let x of subgraph.elements){
        if( x instanceof Cut){
            UM.last_mouse_pos = new Point(x.x, x.y);
            x.updatePos( new Point( start_x + x.rad_x, start_y + x.rad_y  ) );

            let new_width = x.rad_x *2;
            let new_height = x.rad_y * 2;
            if ( (start_x + new_width) <= tgt.interier_bounding_box[2] ){
                start_x += (x.rad_x * 2);
            }else if( (start_y + new_height) <= tgt.interier_bounding_box[3] ){
                start_y += (x.rad_y * 2);
            }
        }
    }

    for(let x of subgraph.free_symbols){
        UM.last_mouse_pos = x.center;
        console.log(UM.last_mouse_pos);
        x.updatePos( new Point( start_x, start_y + x.height), false );

        let new_width = x.width;
        let new_height = x.height;
        console.log(start_x + new_width, tgt.interier_bounding_box[2]);
        if ( (start_x + new_width) <= tgt.interier_bounding_box[2] ){
            start_x += x.width;
        }else if( (start_y + new_height) <= tgt.interier_bounding_box[3] ){
            start_y += x.height;
        }
		
    }
	
}


/**
* Erasure erase any graph from even level
*
* @param {Subgraph} subgraph
*/

function erasure(){
    throw 'TODO';
}

export{
    doubleCut,
    insertion,
    erasure
};
