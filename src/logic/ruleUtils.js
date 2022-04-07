import {Cut} from '../cut.js';
import {Symbolic} from '../symbol.js';

/**
 * Check if two subgraphs are logically equal
 * @param {Cut|Symbolic} first
 * @param {Cut|Symbolic} second 
 */
function checkIfSubgraphsAreaEqual(first, second){
    //check same types
    if( ((first instanceof Cut) && (second instanceof Symbolic)) ||
        ((first instanceof Symbolic) && (second instanceof Cut))){
        return false;
    }

    if(first instanceof Symbolic){
        return first.letter === second.letter;
    }

    //subgraphs should have same number of children
    const child_syms = first.child_cuts.length === second.child_cuts.length;
    const child_cuts = first.child_syms.length === second.child_syms.length;
    if(!child_syms || !child_cuts){
        return false;
    }

    return checkSubgraphEqualByLevel(first, second);
}


/**
 * compare two subgraph's levels to check if they're the same and then move to the next level
 * @param {Cut} first 
 * @param {Cut} second 
 * @returns bool
 */
function checkSubgraphEqualByLevel(first, second){

    for(const i of first.child_syms.sort((a,z) => a.id - z.id )){
        for(const j of second.child_syms.sort((a,z) => a.letter.localCompare(z.letter) )){
            if( i.letter != j.letter ){
                return false;
            }
        }
    }

    for(const i of first.child_cuts.sort((a,z) => a.id - z.id).filter(cut => cut.level === this.level+1)){
        for(const j of second.child_cuts.sort((a,z) => a.id - z.id).filter(cut => cut.level === this.level +1)){
            return checkSubgraphEqualByLevel(i,j);
        }
    }

    return true;
}


export {
    checkIfSubgraphsAreaEqual
};