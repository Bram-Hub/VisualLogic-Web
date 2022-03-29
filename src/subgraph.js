import { CanvasManager } from './canvasManager.js';
import {Cut} from './cut.js';
import {Symbolic} from './symbol.js';

/**
* A subgraph is a collection of cuts and symbols together
*/
class Subgraph{
    /**
	* @param {Array} parts
	*/ 
    constructor(parts){
        this.elements = parts;
        
    }

}


export{
    Subgraph,
};
