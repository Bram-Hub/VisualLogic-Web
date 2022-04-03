import {checkIfSubgraphsAreaEqual} from './ruleUtils.js';
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
        return displayError('Can only double cut between 2 immediate cuts');
    }

    if ( !(parts[0] instanceof Cut) || !(parts[1] instanceof Cut) ){
        return displayError('Can only perform double cut between two cuts');
    }

    if ( parts[0].level == parts[1].level){
        return displayError('Cannot perform a double cut between cuts on the same level');
    }

    const err  = 'Can only perform double cut between two directly nested cuts with an empty subgraph in between them';


    //check if between the two cuts there's an empty graph
    const parent = parts[0].level < parts[1].level ? parts[0] : parts[1];
    const child = parts[0].level > parts[1].level ? parts[0] : parts[1];

    if (parent.level != child.level-1){
        return displayError(err);
    }

    for (const c of parent.getChildren()){
        if (c.id != child.id){
            return displayError(err);
        }
    }


    deleteObject(parent);
    deleteObject(child);

    return displaySuccess('Double cut complete');
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
        return displayError('Can only apply erasure to 1 subgraph at a time');
    }

    const tgt = parts[0];
    if (tgt instanceof Symbolic){
        if (!tgt.isEvenLevel()){
            return displayError('Can only apply erasure to subgraph on an even level');
        }

        deleteObject(tgt);
        return displaySuccess('Erasure Complete');
    }

    if (!tgt.isEvenLevel()){
        return displayError('Can only apply erasure to subgraph on an even level');
    }

    deleteObjectRecursive(tgt);
    return displaySuccess('Erasure Complete');
}


/**
 * erase a copy of a subgraph at any nested level
 * @param {Array} parts
 */
function deiteration(parts){
    if(parts.length !== 2){
       return displayError("Must select two subgraphs to perform deiteration");
    }

    //the first element is the copy to delete
    if(!checkIfSubgraphsAreaEqual(parts[0], parts[1])){
        return displayError("Selected subgraphs are not equivalent");
    }

    deleteObjectRecursive(parts[0]);
    return displaySuccess('Erasure Complete');
}

export {
    doubleCut,
    insertion,
    erasure,
    deiteration
};
