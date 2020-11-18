import {Cut} from './cut.js';
import {Symbolic} from './symbol.js';
import {getRandomString} from '../src/main.js';

/**
* A subgraph is a collection of cuts and symbols together
*/
class Subgraph{
    /**
	* @param {Array} parts
	* @param {Cut|Symbol|null} root
	*/ 
    constructor(parts, root = null){
        this.elements = parts;
        this.root = root === null ? parts[0] : root;
        this.id = getRandomString();
        //map the elements by what level they're on

        this.levels = {};
        this.free_symbols = [];
        this.captured_symbols = [];

        for(let x of this.elements){
            if( typeof this.levels[x.level] === 'undefined' ){
                this.levels[x.level] = [x];
            }else{
                let old = this.levels[x.level];
                this.levels[old] = (old.push(x));
            }


            if (x instanceof Cut){
                this.captured_symbols = this.captured_symbols.concat(x.child_syms);
            }
        }

        for(let x of this.elements){
            if (x instanceof Symbolic){
                if(!this.captured_symbols.includes(x)){
                    this.free_symbols.push(x);
                }
            }
        }
    }


    /**
	* Calculate the real area of all the ellipses and free symbols in this subgraph
	*
	* @returns {Number}
	*/
    getArea(){
        let ret = 0;
        for(let x of this.elements){
            if(x instanceof Cut){
                ret += x.area;
            }
        }
        for(let x of this.free_symbols){
            ret += x.area;
        }
        return ret;
    }


    /**
	* Calculate area based on the outer bounding box of the cuts in this subgraph
	*
	* @returns {Number}
	*/
    getBoundedArea(){
        let ret = 0;
        for(let x of this.elements){
            if(x instanceof Cut){
                ret += x.bounded_area;
            }
        }

        for(let x of this.free_symbols){
            ret += x.area;
        }
        return ret;
    }


    isEqual(other){
        /*
		 check if every symbol has the same char, & same level
		 each cut is on the same level and has same children
		*/
		
        if(other.elements.length !== this.elements.length){
            return false;
        }


        if(other.id === this.id){
            return true;
        }

        //TODO

    }


    /**
	* Create a text representation of this graph
	*
	* @returns {String}
	*/
    toString(){
        throw 'TODO';
    }

}


export{
    Subgraph,
};
