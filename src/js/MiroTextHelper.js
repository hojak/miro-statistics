const ItemEventList = require('./ItemEventList')
const StatusChangedEvent = require('./StatusChangedEvent')

module.exports = {
  START_EVENT_LIST: '<p>-------- START OF KANBAN EVENT LIST ---------</p>',
  END_EVENT_LIST: '<p>--------  END OF KANBAN EVENT LIST  ---------</p>',

  START_SHAPE_MARKER: '[<',
  END_SHAPE_MARKER: '>]',

  extractEventList: function (string, objectId) {
    const start = string.indexOf(this.START_EVENT_LIST)
    const end = string.indexOf(this.END_EVENT_LIST)

    if (start > -1 && end > -1) {
      const found = string.substr(start + this.START_EVENT_LIST.length, end - start - this.START_EVENT_LIST.length)
      return ItemEventList.createFromMiroString(found, objectId)
    } else {
      return new ItemEventList()
    }
  },

  registerStatusChange: function (oldText, objectId, newStatus) {
    const foundList = this.extractEventList(oldText, objectId)
    foundList.filterTemplateEventsByStatus(newStatus).addEvent(new StatusChangedEvent(objectId, newStatus))
    return this.replaceEventList(oldText, foundList)
  },

  removeEventList: function (oldText) {
    const start = oldText.indexOf(this.START_EVENT_LIST)
    const end = oldText.indexOf(this.END_EVENT_LIST)

    if (start > -1 && end > -1) {
      return oldText.substr(0, start) + oldText.substr(end + this.END_EVENT_LIST.length)
    } else {
      return oldText
    }
  },

  replaceEventList: function (text, newList) {
    const start = text.indexOf(this.START_EVENT_LIST)
    const end = text.indexOf(this.END_EVENT_LIST)

    if (start > -1 && end > -1) {
      return text.substr(0, start) +
                this.getEventlistRepresentation(newList) +
                text.substr(end - 1 + this.END_EVENT_LIST.length + 1)
    } else {
      return text + this.getEventlistRepresentation(newList)
    }
  },

  getEventlistRepresentation: function (eventList) {
    return this.START_EVENT_LIST + eventList.toReadableMiroList() + this.END_EVENT_LIST
  },

  textIsShapeMarker: function (text) {
    text = text.trim()
    return text.startsWith(this.START_SHAPE_MARKER) &&
            text.endsWith(this.END_SHAPE_MARKER)
  },

  getShapeName: function (text) {
    text = text.trim()
    if (!this.textIsShapeMarker(text)) {
      return null
    }

    return text.substring(this.START_SHAPE_MARKER.length, text.length - this.END_SHAPE_MARKER.length)
  }

}
