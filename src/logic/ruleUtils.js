import {Cut} from '../cut.js';
import {Point} from '../lib/point.js';
import {Symbolic} from '../symbol.js';
import {isRectInRect} from '../lib/math.js';
import {CanvasManager} from '../canvasManager.js';
import {UserInputManager} from '../userInput.js';

import {drawPoint} from '../renderer.js';

/**
 * Check if two subgraphs are logically equal
 * @param {Cut|Symbolic} first
 * @param {Cut|Symbolic} second
 */
export function checkIfSubgraphsAreaEqual(first, second){
    //check same types
    if ( ((first instanceof Cut) && (second instanceof Symbolic)) ||
        ((first instanceof Symbolic) && (second instanceof Cut))){
        return false;
    }

    if (first instanceof Symbolic){
        return first.letter === second.letter;
    }

    //subgraphs should have same number of children
    const child_syms = first.child_cuts.length === second.child_cuts.length;
    const child_cuts = first.child_syms.length === second.child_syms.length;
    if (!child_syms || !child_cuts){
        return false;
    }

    return checkSubgraphEqualByLevel(first, second);
}


/**
 * @param {Cut} tgt_graph
 * @param {Cut|Symbolic} element
 */
export function injectSubgraph(tgt_graph, element){
    let CM = CanvasManager;

    if(element instanceof Symbolic){
        //if a symbol check if there's enough room and just copy over 
        let result = canFit(tgt_graph, element);
        if(result[0]){
            console.log('adding ', result[1]);
            let new_point = result[1];
            let next = new Symbolic(element.letter, new Point(new_point[0]+25, new_point[1]+25));
            CM.syms.push(next);   
            CM.id_map[next.id] = next;
        }
    }
}


/**
 * Rearrange the elements 
 * https://www.csc.liv.ac.uk/~epa/surveyhtml.html
 */
export function compressCutChildren(cut){
    let start_x = cut.interier_bounding_box[0];
    let end_x = cut.interier_bounding_box[2];
    let start_y = cut.interier_bounding_box[1];
    let end_y = cut.interier_bounding_box[3];

    let interval = 50;

    CanvasManager.debug_points.push(new Point(start_x, start_y));

    for(let i = 0; i < cut.child_cuts.length; i++){
        let next = cut.child_cuts[i];

        UserInputManager.last_mouse_pos = new Point(next.x, next.y);
        next.updatePos(new Point(start_x, start_y));


    }
}


/**
 * compare two subgraph's levels to check if they're the same and then move to the next level
 * @param {Cut} first
 * @param {Cut} second
 * @returns bool
 */
function checkSubgraphEqualByLevel(first, second){

    for (const i of first.child_syms.sort((a,z) => a.id - z.id )){
        for (const j of second.child_syms.sort((a,z) => a.letter.localCompare(z.letter) )){
            if ( i.letter != j.letter ){
                return false;
            }
        }
    }

    for (const i of first.child_cuts.sort((a,z) => a.id - z.id).filter(cut => cut.level === this.level+1)){
        for (const j of second.child_cuts.sort((a,z) => a.id - z.id).filter(cut => cut.level === this.level +1)){
            return checkSubgraphEqualByLevel(i,j);
        }
    }

    return true;
}


/**
 * See if b can fit into a's and return position found
 * 
 * first get all the elements of a 
 */
function canFit(a,b){
    let start_x = a.interier_bounding_box[0];
    let end_x = start_x + a.interier_bounding_box[2];
    let start_y = a.interier_bounding_box[1];
    let end_y = start_y + a.interier_bounding_box[3];

    const b_height = b.bounding_box[3] - b.bounding_box[1];
    const b_length = b.bounding_box[2] - b.bounding_box[0];

    if((end_y - start_y) < b_height){
        return [false, null];
    }

    if((end_x - start_x) < b_length){
        return [false, null];
    }

    //start scanning for next available tile
    let interval_x = b_length;
    let interval_y = b_height;
    for(let i = 0; i <= end_x; i += 50 ){
        for(let j = 0; j <= end_y; j += 50){
            if(!isRectInRect( [start_x + i, start_y + j, interval_x + i, interval_y + j], b.bounding_box )){
                return [true, [start_x, start_y]];
            }
        }
    }

    return [false, null];
}

