class StatusChangedEvent {

    constructor ( objectId, newStatus, timestamp = null ) {
        this.objectId = objectId;
        this.newStatus = newStatus;
        this.timestamp = timestamp || new Date();
    }

    getTimestamp () {
        return this.timestamp;
    }

}

module.exports = StatusChangedEvent;