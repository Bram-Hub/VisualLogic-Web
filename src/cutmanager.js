
function drawDistancesOfCuts(){
	
	for (let i of CUTS){
		for(let j of CUTS){
			if ( j === i )
				continue;

			drawVector(
				new Vector( i.center, j.center )
			);

		}
	}

}


/**
* https://www.dofactory.com/javascript/singleton-design-pattern
*/

var CutManager = (function(){
    var instance = null;

    function createInstance() {
        return new __CUT_MANAGER();
    }
 
    return {
        clear : function(){
            instance = null;
        },

        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


class __CUT_MANAGER{
    constructor(){
   		this.objs = new Map();

   		for(let c of CUTS){
   			this.objs.set(c.ID, c);
   		}

   		for(let s of SYMBOLS){
   			this.objs.set(s.ID, s);
   		}

    }	


    removeByID(id){
    	return this.objs.delete(id);
    }


    addObj(obj){
    	this.objs.set(obj.ID, obj);
    }


    getById(id){
    	let t = this.objs.get(id);
    	if ( typeof t === "undefined")
    		return null;

    	return t;
    }


    recalculate(){
    	for(let c of CUTS){
			c.level = 1;
			c.child_syms = [];
			c.child_cuts = [];
		}

		for(let i = 0; i < CUTS.length; i++ ){
			for(let j = i; j < CUTS.length; j++){
				if ( i === j)
					continue;


				//are there any cuts under i, if so add it to i's children.
				if ( isWithinCut(CUTS[j], CUTS[i]) ){
					CUTS[i].child_cuts.push(CUTS[j]);
					CUTS[j].level = CUTS[i].level + 1;
				}

			}

			//do the same for symbols
			for (let k = 0; k < SYMBOLS.length; k++){
				if ( isWithinCut(SYMBOLS[k], CUTS[i]) ){
					CUTS[i].child_syms.push(SYMBOLS[k]);
				}
			}

		}
    }

}
