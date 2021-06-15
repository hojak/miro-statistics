const Point = require("./Point");
const KanbanTargetShape = require ( "./KanbanTargetShape");
const MiroTextHelper = require("./MiroTextHelper");

class KanbanTargetShapeList {

    static async createFromMiroBoard() {
        return await miro.board.widgets.get({type: 'shape'})
            .then ( data => new KanbanTargetShapeList(data
                .filter ( shape => MiroTextHelper.textIsShapeMarker ( shape.plainText ) )
                .map ( shape => new KanbanTargetShape(
                                        shape.id,
                                        MiroTextHelper.getShapeName ( shape.plainText ),
                                        new Point( shape.bounds.left, shape.bounds.top ),
                                        new Point( shape.bounds.right, shape.bounds.bottom )
                                    )
                        )
                )
            )
    }

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