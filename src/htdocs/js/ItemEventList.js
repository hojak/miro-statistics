const StatusChangedEvent = require("./StatusChangedEvent");

class ItemEventList {

    constructor() {
        this.items = []
    }

    getSize() {
        return this.items.length;
    }

    addEvent ( newEvent ) {
        if ( ! (newEvent instanceof StatusChangedEvent)) {
            throw 'IllegalArgument';
        }

        let newPosition = this.findInsertPosition ( newEvent );
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
            while ( position > 0 && this.items[position].getTimestamp() > newEvent.getTimestamp() ) {
                position --;
            }
            return position;
        }
    }

    getItems() {
        return this.items;
    }

}

module.exports = ItemEventList;