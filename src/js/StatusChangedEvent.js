const dayjs = require('../../node_modules/dayjs/dayjs.min')

class StatusChangedEvent {
  static get DATE_TIME_PATTERN () { return 'YYYY-MM-DD HH:mm' }

  static formatTimeStamp (timestamp) {
    return dayjs(timestamp).format(StatusChangedEvent.DATE_TIME_PATTERN)
  }

  constructor (objectId, newStatus, timestamp = null) {
    this._objectId = objectId
    this._newStatus = newStatus
    this._timestamp = timestamp || new Date()
  }

  getTimestamp () {
    return this._timestamp
  }

  conflicts (otherEvent) {
    return otherEvent.getObjectId() === this.getObjectId() && otherEvent.getNewStatus() === this.getNewStatus()
  }

  getObjectId () {
    return this._objectId
  }

  getNewStatus () {
    return this._newStatus
  }

  isTemplate () {
    return false
  }

  toCSV () {
    return this._objectId + ';' +
      this._newStatus + ';' +
      this._timestamp + ';' +
      new Date(this._timestamp).toLocaleDateString() + ';' +
      new Date(this._timestamp).toLocaleTimeString() + ';' +
      '\n'
  }

  get formattedTimestamp () {
    return StatusChangedEvent.formatTimeStamp(this.timestamp)
  }

  get timestamp () { return this._timestamp }
  get objectId () { return this._objectId }
  get newStatus () { return this._newStatus }

  get readableMiroRepresentation () {
    return this.newStatus + ': ' + this.formattedTimestamp
  }
}

module.exports = StatusChangedEvent
