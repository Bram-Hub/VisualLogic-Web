import {displaySuccess, displayError} from '../renderer.js';
import {CanvasManager} from '../canvasManager.js';
import {deleteObject, deleteObjectRecursive} from '../userInput.js';
import {Cut} from '../cut.js';
import {Symbolic} from '../symbol.js';
import {Point} from '../lib/point.js';
import {UserInputManager} from '../userInput.js';


/**
* Given two cuts seperated by 1 level, erase both of them
* Similar to a double negation
*
* Performs checks if double check possible
*
* @param {Array} parts - list of objects to try and perform a double cut
*/
function doubleCut(parts){
    if(parts.length !== 2){
        displayError('Can only double cut between 2 immediate cuts');
        return;
    }

    if( !(parts[0] instanceof Cut) || !(parts[1] instanceof Cut) ){
        displayError('Can only perform double cut between two cuts');
        return;
    }

    if( parts[0].level == parts[1].level){
        displayError('Cannot perform a double cut between cuts on the same level');
        return;
    }

    const err  = 'Can only perform double cut between two directly nested cuts with an empty subgraph in between them';


    //check if between the two cuts there's an empty graph
    const parent = parts[0].level < parts[1].level ? parts[0] : parts[1];
    const child = parts[0].level > parts[1].level ? parts[0] : parts[1];
  
    if(parent.level != child.level-1){
        displayError(err);
        return;
    }

    for(const c of parent.getChildren()){
        if(c.id != child.id){
            displayError(err);
            return;
        }
    }   


    deleteObject(parent);
    deleteObject(child);

    displaySuccess('Double cut complete');
}


/**
* Insertion a subgraph at an odd level
*
* @param {Array} parts
*
* TODO: get current elements in tgt graph level and recalculate the subgraph with them
*/
function insertion(parts){
    let CM = CanvasManager;

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
    let UM = UserInputManager;

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
        x.updatePos( new Point( start_x, start_y + x.height), false );

        let new_width = x.width;
        let new_height = x.height;

        if ( (start_x + new_width) <= tgt.interier_bounding_box[2] ){
            start_x += x.width;
        }else if( (start_y + new_height) <= tgt.interier_bounding_box[3] ){
            start_y += x.height;
        }
		
    }
	
}


/**
* Erasure erase any graph from even level
* @param {Array}
*/
function erasure(parts){
    if(parts.length !== 1){
        displayError('Can only apply erasure to 1 subgraph at a time');
        return;
    }

    const tgt = parts[0];
    if(tgt instanceof Symbolic){
        if(!tgt.isEvenLevel()){
            displayError('Can only apply erasure to subgraph on an even level');
            return;
        }

        deleteObject(tgt);
        displaySuccess('Erasure Complete');
        return;
    }

    if(!tgt.isEvenLevel()){
        displayError('Can only apply erasure to subgraph on an even level');
        return;
    }

    deleteObjectRecursive(tgt);
    displaySuccess('Erasure Complete');
}

export{
    doubleCut,
    insertion,
    erasure
};
