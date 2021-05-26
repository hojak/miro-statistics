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

        this.items.push ( newEvent );
        return this;
    }

    getItems() {
        return this.items;
    }

}

module.exports = ItemEventList;