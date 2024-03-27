const StatusChangedEvent = require('./StatusChangedEvent')
const StatusChangedEventTemplate = require('./StatusChangedEventTemplate')

class StatusChangedEventFactory {
  static createFromMiroString (miroString, objectId) {
    const colonPosition = miroString.indexOf(':')

    if (colonPosition === -1) {
      return null
    }

    const status = miroString.substr(0, colonPosition).trim()
    const dateString = miroString.substr(colonPosition + 1).trim()

    if (dateString.toLowerCase() === StatusChangedEvent.DATE_TIME_PATTERN.toLowerCase()) {
      return new StatusChangedEventTemplate(objectId, status)
    }

    return new StatusChangedEvent(objectId, status, Date.parse(dateString))
  }
}

module.exports = StatusChangedEventFactory
