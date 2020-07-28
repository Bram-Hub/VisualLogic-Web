import {Cut} from './cut.js';
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

		for(let x of this.elements){
			if( typeof this.levels[x.level] === 'undefined' ){
				this.levels[x.level] = [x];
			}else{
				let old = this.levels[x.level];
				this.levels[old] = (old.push(x));
			}
		}
	}


	/**
	* @returns {Number}
	*/
	getArea(){
		let ret = 0;
		for(let x of this.elements){
			if(x instanceof Cut){
				ret += x.area;
			}
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

	}


	/**
	* Create a text representation of this graph
	*
	* @returns {String}
	*/
	toString(){
		throw "TODO";
		return "";
	}

}


export{
	Subgraph
}