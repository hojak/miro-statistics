const StatusChangedEvent = require('./StatusChangedEvent')

class StatusChangedEventTemplate extends StatusChangedEvent {
  constructor (objectId, newStatus) {
    super(objectId, newStatus, null)
    this._objectId = objectId
    this._newStatus = newStatus
    this._timestamp = StatusChangedEvent.DATE_TIME_PATTERN
  }

  isTemplate () {
    return true
  }
}

module.exports = StatusChangedEventTemplate
