const Point = require("./Point");
const KanbanTargetShape = require ( "./KanbanTargetShape");

class KanbanTargetShapeList {

    constructor ( items ) {
        if ( ! items ) {
            items = [];
        }
        if ( ! Array.isArray ( items )) {
            throw new TypeError ( "not an array but " + typeof(items) + " items: " + items);
        }
        items.forEach ( item => {
            if ( ! ( item instanceof KanbanTargetShape )) {
                throw new TypeError ( "not a KanbanTargetShape");
            }
        } );

        this.items = items;
    }

    addShape (shape ) {
        if ( ! ( shape instanceof KanbanTargetShape )) {
            throw new TypeError ( "not a KanbanTargetShape");
        }

        this.items.push ( shape );

        return this;
    }

    get Items () { return this.items; }

}

module.exports = KanbanTargetShapeList;