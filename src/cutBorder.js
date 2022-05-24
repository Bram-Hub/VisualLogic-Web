import {UserInputManager} from './userInput.js';
import {CanvasManager} from './canvasManager.js';

/**
 * CutBorder represents the ring around a cut and is used for resizing a cut
 */
class CutBorder{
    constructor(par){
        this.parent = par;
        this.id = CanvasManager.getNextId();

        this.scale_speed = 1;
    }

    updatePos(new_pos){
        const UM = UserInputManager;
        let dx = (new_pos.x - UM.last_mouse_pos.x) * this.scale_speed;
        let dy = (new_pos.y - UM.last_mouse_pos.y) * this.scale_speed;
        const c = this.parent;

        if ( new_pos.leftOf(c.center()) ){
            dx = -dx;
        }

        if ( new_pos.above(c.center()) ){
            dy = -dy;
        }

        this.parent.rad_x += dx;
        this.parent.rad_y += dy;

        UM.last_mouse_pos = new_pos;
        this.parent.recalculateBoundingBox();
    }

    toString(){
        return this.id.toString();
    }

    serialize(){
        function replacer(key,value){
            if (key === 'parent'){
                return value.id;
            } else {
                return value;
            }
        }
        return JSON.stringify(this, replacer);
    }
}


export {
    CutBorder
};