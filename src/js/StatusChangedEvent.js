const dayjs = require('../../node_modules/dayjs/dayjs.min')

class StatusChangedEvent {
  static formatTimeStamp (timestamp) {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
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

  get timestamp () { return this._timestamp }
  get objectId () { return this._objectId }
  get newStatus () { return this._newStatus }

  get readableMiroRepresentation () {
    return this.newStatus + ': ' + StatusChangedEvent.formatTimeStamp(this.timestamp)
  }

  static createFromMiroString (miroString, objectId) {
    const colonPosition = miroString.indexOf(':')

    if (colonPosition === -1) {
      return null
    }

    const status = miroString.substr(0, colonPosition).trim()
    const dateString = miroString.substr(colonPosition + 1).trim()

    return new StatusChangedEvent(objectId, status, Date.parse(dateString))
  }
}

module.exports = StatusChangedEvent
