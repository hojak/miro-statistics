const ItemEventList = require("./ItemEventList")

module.exports = {
    START_EVENT_LIST : "\n-------- START OF KANBAN EVENT LIST ---------\n",
    END_EVENT_LIST :   "\n--------  END OF KANBAN EVENT LIST  ---------\n",

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



}