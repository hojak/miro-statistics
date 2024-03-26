const StatusChangedEvent = require('./StatusChangedEvent')

class StatusChangedEventDummy extends StatusChangedEvent {
  constructor (objectId, newStatus) {
    super(objectId, newStatus, null)
    this._objectId = objectId
    this._newStatus = newStatus
    this._timestamp = StatusChangedEvent.DATE_TIME_PATTERN
  }

  isDummy () {
    return true
  }
}

module.exports = StatusChangedEventDummy
