import {displaySuccess, displayError} from '../renderer.js';
import {deleteObject, deleteObjectRecursive} from '../userInput.js';
import {Cut} from '../cut.js';
import {Symbolic} from '../symbol.js';


/**
* Given two cuts seperated by 1 level, erase both of them
* Similar to a double negation
*
* Performs checks if double check possible
*
* @param {Array} parts - list of objects to try and perform a double cut
*/
function doubleCut(parts){
    if (parts.length !== 2){
        displayError('Can only double cut between 2 immediate cuts');
        return;
    }

    if ( !(parts[0] instanceof Cut) || !(parts[1] instanceof Cut) ){
        displayError('Can only perform double cut between two cuts');
        return;
    }

    if ( parts[0].level == parts[1].level){
        displayError('Cannot perform a double cut between cuts on the same level');
        return;
    }

    const err  = 'Can only perform double cut between two directly nested cuts with an empty subgraph in between them';


    //check if between the two cuts there's an empty graph
    const parent = parts[0].level < parts[1].level ? parts[0] : parts[1];
    const child = parts[0].level > parts[1].level ? parts[0] : parts[1];

    if (parent.level != child.level-1){
        displayError(err);
        return;
    }

    for (const c of parent.getChildren()){
        if (c.id != child.id){
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
function insertion(){
    throw 'Not implemented';

}


/**
* Erasure erase any graph from even level
* @param {Array}
*/
function erasure(parts){
    if (parts.length !== 1){
        displayError('Can only apply erasure to 1 subgraph at a time');
        return;
    }

    const tgt = parts[0];
    if (tgt instanceof Symbolic){
        if (!tgt.isEvenLevel()){
            displayError('Can only apply erasure to subgraph on an even level');
            return;
        }

        deleteObject(tgt);
        displaySuccess('Erasure Complete');
        return;
    }

    if (!tgt.isEvenLevel()){
        displayError('Can only apply erasure to subgraph on an even level');
        return;
    }

    deleteObjectRecursive(tgt);
    displaySuccess('Erasure Complete');
}

export {
    doubleCut,
    insertion,
    erasure
};
