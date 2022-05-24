import {checkIfSubgraphsAreaEqual, injectSubgraph, compressCutChildren} from './ruleUtils.js';
import {deleteObject, deleteObjectRecursive} from '../userInput.js';
import {displaySuccess, displayError} from '../renderer.js';
import {getRectArea} from '../lib/math.js';
import {Symbolic} from '../symbol.js';
import {Cut} from '../cut.js';


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
* 
* first get all distinct subgraphs that are being inserted (all graphs that are at level 0 of the mini renderer)
* take existing elements and tile them within the bounding box
* try and tile the largest elements and then the smallest
* if doesn't fit expand to requested size
*    check if the expanded area collides with an existing element
*    if so push it towards the direction the element is being expanded towards 
*
* @param {Array} parts
*
*/
function insertion(tgt_element, parts){
    if(!(tgt_element instanceof Cut)){
        return displayError('Cannot insert into a symbol');
    }

    //first get all top level components  
    let top_levels = parts.filter(x => x.level === 0)
                          .sort((a,b) => getRectArea(a.bounding_box) <= getRectArea(b.bounding_box) );

    if(top_levels.length === 0){
        return displaySuccess("Finished insertion");
    }

    compressCutChildren(tgt_element);
    
    for(let element of top_levels){
        //injectSubgraph(tgt_element, element);
    }

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
    if (parts.length !== 2){
        return displayError('Must select two subgraphs to perform deiteration');
    }

    if (parts[0].level === parts[1].level){
        return displayError('Deiteration can not be done between two subgraphs on the same level');
    }

    //the first element is the copy to delete
    if (!checkIfSubgraphsAreaEqual(parts[0], parts[1])){
        return displayError('Selected subgraphs are not equivalent');
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
