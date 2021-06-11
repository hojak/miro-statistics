const ItemEventList = require("./ItemEventList");
const StatusChangedEvent = require("./StatusChangedEvent");

module.exports = {
    START_EVENT_LIST : "\n-------- START OF KANBAN EVENT LIST ---------\n",
    END_EVENT_LIST :   "\n--------  END OF KANBAN EVENT LIST  ---------\n",

    START_SHAPE_MARKER : '[<',
    END_SHAPE_MARKER : '>]',

    extractEventList : function ( string, objectId) {
        const start = string.indexOf ( this.START_EVENT_LIST );
        const end = string.indexOf ( this.END_EVENT_LIST );

        if ( start > -1 && end > -1 ) {
            const found = string.substr ( start + this.START_EVENT_LIST.length, end - start - this.START_EVENT_LIST.length);
            return ItemEventList.createFromMiroString(found, objectId);
        } else {
            return new ItemEventList();
        }
    },

    registerStatusChange : function ( oldText, objectId, newStatus ) {
        let foundList = this.extractEventList( oldText, objectId );
        foundList.addEvent( new StatusChangedEvent(objectId, newStatus));
        return this.replaceEventList( oldText, foundList );
    },

    removeEventList : function ( oldText, newList ) {
        const start = oldText.indexOf ( this.START_EVENT_LIST );
        const end = oldText.indexOf ( this.END_EVENT_LIST );

        if ( start > -1 && end > -1 ) {
            return oldText.substr(0,start) + oldText.substr(end + this.END_EVENT_LIST.length);
        } else {
            return oldText;
        }
    },

    replaceEventList : function ( text, newList ) {
        const start = text.indexOf ( this.START_EVENT_LIST );
        const end = text.indexOf ( this.END_EVENT_LIST );

        if ( start > -1 && end > -1 ) {
            return text.substr(0,start-1)
                + this.getEventlistRepresentation( newList )
                + text.substr(end + this.END_EVENT_LIST.length+1);
        } else {
            return text + this.getEventlistRepresentation( newList );
        }
    },

    getEventlistRepresentation : function ( eventList ) {
        return this.START_EVENT_LIST + eventList.toReadableMiroList() + this.END_EVENT_LIST;
    },

    textIsShapeMarker : function ( text ) {
        text = text.trim();
        return text.startsWith ( this.START_SHAPE_MARKER )
            && text.endsWith ( this.END_SHAPE_MARKER )
    }

}