// const StatusChangedEvent = require('./StatusChangedEvent')

class CfdAnalyzer {
  constructor (columnDefinition, eventList) {
    this._boardColumns = columnDefinition
    this._eventList = eventList

    this._timestampOfDaily =
        this._startAtDate = null
    this._endAtDate = null

    this._hourOfDaily = 9
    this._minuteOfDaily = 0
  }

  get startAtDate () {
    return this._startAtDate
  }

  set startAtDate (date) {
    this._startAtDate = date
  }

  get endAtDate () {
    return this._endAtDate
  }

  set endAtDate (date) {
    this._endAtDate = date
  }

  get hourOfDaily () {
    return this._hourOfDaily
  }

  set hourOfDaily (hour) {
    this._hourOfDaily = hour
  }

  get minuteOfDaily () {
    return this._minuteOfDaily
  }

  set minuteOfDaily (minute) {
    this.minuteOfDaily = minute
  }

  transpose (array) {
    return array.reduce((prev, next) => next.map((item, i) =>
      (prev[i] || []).concat(next[i])
    ), [])
  }

  getCfdData () {
    const listOfDailyTimestamps = this.getTimestampsOfDaylies()

    let indexOfNextDaily = 0

    const currentStatus = this._boardColumns.map(item => 0)
    const cardStates = {}

    const statusName2ColumnNumber = {}
    this._boardColumns.forEach((columns, index) => {
      columns.forEach(column => { statusName2ColumnNumber[column] = index })
    })

    const dailyCardNumbers = []
    this._eventList.forEach(event => {
      while (event.getTimestamp() > listOfDailyTimestamps[indexOfNextDaily] && indexOfNextDaily < listOfDailyTimestamps.length) {
        dailyCardNumbers.push([...currentStatus])
        indexOfNextDaily++
      }

      if (event.getObjectId() in cardStates) {
        currentStatus[cardStates[event.getObjectId()]]--
        delete (cardStates[event.getObjectId()])
      }

      if (event.getNewStatus() in statusName2ColumnNumber) {
        cardStates[event.getObjectId()] = statusName2ColumnNumber[event.getNewStatus()]
        currentStatus[cardStates[event.getObjectId()]]++
      }
    })

    while (indexOfNextDaily < listOfDailyTimestamps.length) {
      dailyCardNumbers.push([...currentStatus])
      indexOfNextDaily++
    }

    // transponse
    const result = this.transpose(dailyCardNumbers)

    return result
  }

  getFirstDailyForEventlist () {
    let timeOfFirstEvent = null
    if (this._eventList.length > 0) {
      timeOfFirstEvent = this._eventList[0].getTimestamp()
    }

    if (timeOfFirstEvent === null || (this._startAtDate !== null && timeOfFirstEvent < this._startAtDate)) {
      timeOfFirstEvent = this._startAtDate
    }

    if (timeOfFirstEvent === null) {
      return null
    }

    const startDate = new Date(timeOfFirstEvent)
    startDate.setHours(this._hourOfDaily)
    startDate.setMinutes(this._minuteOfDaily)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    if (startDate.getTime() > timeOfFirstEvent) {
      startDate.setDate(startDate.getDate() - 1)
    }

    return startDate.getTime()
  }

  getLastDailyForEventlist () {
    let timeOfLastEvent = null
    if (this._eventList.length > 0) {
      timeOfLastEvent = this._eventList[this._eventList.length - 1].getTimestamp()
    }
    if (timeOfLastEvent === null || (this._endAtDate !== null && timeOfLastEvent > this._endAtDate)) {
      timeOfLastEvent = this._endAtDate
    }

    if (timeOfLastEvent === null) {
      return null
    }

    const endDate = new Date(timeOfLastEvent)
    endDate.setHours(this._hourOfDaily)
    endDate.setMinutes(this._minuteOfDaily)
    endDate.setSeconds(0)
    endDate.setMilliseconds(0)

    if (endDate.getTime() < timeOfLastEvent) {
      endDate.setDate(endDate.getDate() + 1)
    }

    return endDate.getTime()
  }

  getTimestampsOfDaylies (eventList) {
    const timestampOfFirstDaily = this.getFirstDailyForEventlist()
    const timestampOfLastDaily = this.getLastDailyForEventlist()

    if (timestampOfFirstDaily === null || timestampOfLastDaily === null) {
      return []
    }

    // todo: care about summertime
    const result = []
    for (let currentTimestampOfDaily = timestampOfFirstDaily; currentTimestampOfDaily <= timestampOfLastDaily; currentTimestampOfDaily += 24 * 3600 * 1000) {
      result.push(currentTimestampOfDaily)
    }

    return result
  }
}

module.exports = CfdAnalyzer
