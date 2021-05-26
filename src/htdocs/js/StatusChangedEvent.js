class StatusChangedEvent {

    constructor ( objectId, newStatus, timestamp = null ) {
        this.objectId = objectId;
        this.newStatus = newStatus;
        this.timestamp = timestamp || new Date();
    }

    getTimestamp () {
        return this.timestamp;
    }

    conflicts ( otherEvent ) {
        return otherEvent.getObjectId() == this.getObjectId() && otherEvent.getNewStatus() == this.getNewStatus();
    }

    getObjectId () {
        return this.objectId;
    }

    getNewStatus () {
        return this.newStatus;
    }

}

module.exports = StatusChangedEvent;