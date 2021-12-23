// const StatusChangedEvent = require('./StatusChangedEvent')

class LtdAnalyzer {
  constructor (doneColumn, ignoreColumns = []) {
    this._doneColumn = doneColumn
    this._ignoreColumns = ignoreColumns
    this._cardDescriptionMap = {}
  }

  setCardDescriptionMap (cardDescriptionMap) {
    this._cardDescriptionMap = cardDescriptionMap
  }

  filterEventLists (cardEventLists) {
    return cardEventLists.filter(eventList => {
      const items = eventList.getItems()

      if (items.length === 0) {
        return false
      }

      if (items[items.length - 1].newStatus !== this._doneColumn) {
        return false
      }

      return items.map(item => item.getNewStatus()).filter(
        status => status !== this._doneColumn && !this._ignoreColumns.includes(status)
      ).length > 0
    })
  }

  orderByLastTimestamp (cardEventLists) {
    return cardEventLists.sort(function (eventListA, eventListB) {
      return eventListA.getItems().slice(-1)[0].getTimestamp() - eventListB.getItems().slice(-1)[0].getTimestamp()
    })
  }

  createLeadTimeMap (cardEventLists) {
    const result = {}
    cardEventLists.forEach(element => {
      const events = element.getItems()
      let indexOfFirstEvent = 0
      while (this._ignoreColumns.includes(events[indexOfFirstEvent].getNewStatus())) {
        indexOfFirstEvent++
      }
      const leadTime = events[events.length - 1].getTimestamp() - events[indexOfFirstEvent].getTimestamp()
      result[events[0].getObjectId()] = Math.ceil(leadTime / (24 * 3600 * 1000))
    })
    return result
  }

  getLeadtimeCardData (leadtimeMap) {
    const result = []

    Object.keys(leadtimeMap).forEach(key => {
      result.push(this.createCardDataForLeadTime(key, leadtimeMap[key]))
    })

    return result
  }

  createCardDataForLeadTime (cardId, leadTime) {
    if (this._cardDescriptionMap[cardId]) {
      return {
        leadTime: leadTime,
        title: this._cardDescriptionMap[cardId].title,
        type: this._cardDescriptionMap[cardId].type,
        finished: this._cardDescriptionMap[cardId].timeOfLastEvent
      }
    } else {
      return {
        leadTime: leadTime,
        title: 'Card ' + cardId,
        type: 'Card',
        finished: null
      }
    }
  }

  getLeadtimeData (cardEventList) {
    const relevantEventLists = this.filterEventLists(cardEventList)
    const orderedEventLists = this.orderByLastTimestamp(relevantEventLists)
    const leadTimeMap = this.createLeadTimeMap(orderedEventLists)

    return this.getLeadtimeCardData(leadTimeMap)
  }
}

module.exports = LtdAnalyzer
