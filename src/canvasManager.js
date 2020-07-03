
/** Handles object being drawn on the canvas or mini renderer */

var CanavasManager = (function(){
    var instance = null;

    function createInstance(canvas, mini_canvas) {
        return new __CANVAS_MANAGER(canvas, mini_canvas);
    }
 
    return {
        clear : function(){
            instance = null;
        },

        init : function(canvas, mini_canvas){
        	instance = createInstance(canvas, mini_canvas);
        },

        getInstance: function () {
            if (!instance) {
                throw "Tried to get uninitialized canvas manager"
            }
            return instance;
        }
    };
})();


class __CANVAS_MANAGER{
    constructor(canvas, mini_canvas){
   		this.cuts = [];
   		this.syms = [];
   		this.is_mini_open = false;

   		this.Canvas = canvas;
   		this.MiniCanvas = mini_canvas;

   		this.Context = this.Canvas.getContext("2d");
   		this.MiniContext = this.MiniCanvas.getContext("2d");
    }	

    getContext(){
    	return this.Context;
    }
}
