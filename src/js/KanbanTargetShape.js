const Point = require("./Point");

class KanbanTargetShape {

    constructor( miroId, name, topLeft, bottomRight) {
        if ( ! (topLeft instanceof Point) ) {
            throw new TypeError ( "not a Point");
        }

        if ( ! (bottomRight instanceof Point) ) {
            throw new TypeError ( "not a Point");
        }

        this.miroId = miroId;
        this.name = name;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    get MiroID(){ return this.miroId; }

    get Name() { return this.name; }

    get TopLeft() { return this.topLeft; }

    get BottomRight () { return this.bottomRight; }

    isInside (point) {
        return point.X >= this.topLeft.X && point.X <= this.bottomRight.X  
            && point.Y >= this.topLeft.Y && point.Y <= this.bottomRight.Y
    }
}

module.exports = KanbanTargetShape;
