const StatusChangedEvent = require("./StatusChangedEvent");

class ItemEventList {
    static get ERROR_NOT_AN_EVENT() { return  'not an event'; }
    static get ERROR_NEIGHBOR_CONFLICT() { return 'neighbor conflict' }

    constructor() {
        this.items = []
    }

    getSize() {
        return this.items.length;
    }

    addEvent ( newEvent ) {
        if ( ! (newEvent instanceof StatusChangedEvent)) {
            throw ItemEventList.ERROR_NOT_AN_EVENT;
        }

        let newPosition = this.findInsertPosition ( newEvent );

        this.checkNeighbors ( newEvent, newPosition );

        this.items.splice ( newPosition, 0, newEvent );
        return this;
    }


    findInsertPosition ( newEvent ) {
        if ( this.items.length == 0 ) {
            return 0;
        } else if ( this.items[this.items.length-1].getTimestamp() <= newEvent.getTimestamp () ) {
            return this.items.length;
        } else {
            let position = this.items.length-1;
            while ( position > 0 && this.items[position-1].getTimestamp() > newEvent.getTimestamp() ) {
                position --;
            }
            return position;
        }
    }

    checkNeighbors ( newEvent, newPosition ) {
        if ( this.isEmpty() ) {
            return;
        }

        if ( newPosition < this.items.length  && newEvent.conflicts ( this.items[newPosition])) {
            throw ItemEventList.ERROR_NEIGHBOR_CONFLICT;
        }

        if ( newPosition > 1 && newEvent.conflicts ( this.items[newPosition -1])) {
            throw ItemEventList.ERROR_NEIGHBOR_CONFLICT;
        }
    }

    

    getItems() {
        return this.items;
    }

    isEmpty () {
        return this.items.length == 0;
    }

    toReadableMiroList () {
        return this.items
            .map ( item => item.readableMiroRepresentation )
            .join (",\n");
    }

}

module.exports = ItemEventList;