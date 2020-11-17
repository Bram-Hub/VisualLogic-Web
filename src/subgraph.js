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

		//TODO

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


function pack(cut){
	//compress children first
	for(const x of cut.child_cuts){
		pack(x);
	}


	//if empty
	if(cut.child_cuts.length === 0 && cut.child_syms.length === 0){
		//set to default small size
		cut.rad_x = 60;
		cut.rad_y = 60;
		return;
	}


	//get width & height of all inner cuts & symbols
	const pad = 50;
	let t_w = pad;
	let t_h = pad;
	for(let x of cut.child_cuts){
		t_w += (2*x.rad_x);
		t_h += (2*x.rad_y);
	}

	for(let x of cut.child_syms){
		t_w += x.width;
		t_h += x.width;
	}

	cut.rad_x = t_w/2;
	cut.rad_y = t_h/2;

	//make sure all elements are within the new cut


}


export{
	Subgraph,
	pack
}