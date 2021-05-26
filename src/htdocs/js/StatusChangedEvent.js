class StatusChangedEvent {

    static get dateFormatter() {
        let options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', 
            hour12: false,
            timeStyle: 'short'
        };
        return  new Intl.DateTimeFormat ( 'de-DE', options );
    }

    constructor ( objectId, newStatus, timestamp = null ) {
        this._objectId = objectId;
        this._newStatus = newStatus;
        this._timestamp = timestamp || new Date();
    }

    getTimestamp () {
        return this._timestamp;
    }

    conflicts ( otherEvent ) {
        return otherEvent.getObjectId() == this.getObjectId() && otherEvent.getNewStatus() == this.getNewStatus();
    }

    getObjectId () {
        return this._objectId;
    }

    getNewStatus () {
        return this._newStatus;
    }

    get timestamp() { return this._timestamp; }
    get objectId() { return this._objectId; }
    get newStatus() { return this._newStatus; }

    get readableMiroRepresentation () {
        return this.newStatus + ": " + StatusChangedEvent.dateFormatter.format ( this.timestamp );
    }

    static createFromMiroString ( miroString, objectId ) {
        let colonPosition = miroString.indexOf ( ":");

        if ( colonPosition == -1 ) {
            return null;
        }

        let status = miroString.substr ( 0, colonPosition).trim();
        let dateString = miroString.substr ( colonPosition+1).trim();

        return new StatusChangedEvent ( objectId, status, Date.parse (dateString));
    }

}

module.exports = StatusChangedEvent;