
function drawDistancesOfCuts(){
	let CM = CanvasManager.getInstance();

	for (let i of CM.cuts){
		for(let j of CM.cuts){
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
        let CM = CanvasManager.getInstance();
   		this.objs = new Map();

   		for(let c of CM.cuts){
   			this.objs.set(c.ID, c);
   		}

   		for(let s of CM.cuts){
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
        let CM = CanvasManager.getInstance();
    	for(let c of CM.getCuts()){
			c.level = 1;
			c.child_syms = [];
			c.child_cuts = [];
		}

		
        for(let i of CM.getCuts()){
            for(let j of CM.getCuts()){
                if ( i.id === j.id )
                    continue;

                if ( isWithinCut(i,j) || isWithinCut(j,i) ){

                    if ( i.area > j.area ){
                        i.addChildCut(j);
                        j.level = i.level + 1;
                    }
                }

            }


        }


        for(let c of CM.getCuts()){
            //update any symbols
            for(let s of CM.getSyms()){
                if( isWithinCut(s, c) ){
                    //add this to the innermost in this cut
                    s.level = c.level;
                    getInnerMostCut(c).addChildSym(s);
                }
            }
        }


    }

}
