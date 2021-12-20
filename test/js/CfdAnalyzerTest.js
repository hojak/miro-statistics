const { fail } = require('assert')

const { expect } = require('chai')
const { assert } = require('console')
const CfdAnalyzer = require('../../src/js/CfdAnalyzer')
const StatusChangedEvent = require('../../src/js/StatusChangedEvent')

describe('CfdAnalyzer', function () {
  describe('#constructor()', function () {
    it('has to return something', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      expect(testee).not.to.be.null
    })
  })

  describe('#getCfdData', function () {
    it('has to return an empty array for no events and no defined start and end dates', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])

      const result = testee.getCfdData()

      expect(result).to.be.empty
    })

    it('has to return a two dimensional array of 0, with number of \'lanes\' as first dimension and number of days as second', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      testee.startAtDate = Date.parse('2021-10-10 12:00')
      testee.endAtDate = Date.parse('2021-10-14')

      const result = testee.getCfdData()
      expect(result).has.lengthOf(3)
      result.forEach(laneData => {
        expect(laneData).has.lengthOf(5)
        laneData.forEach(entry => expect(entry).to.be.equal(0))
      })
    })
  })

  describe('#getTimestampsOfDaylies', function () {
    it('has to return an empty list, for no events and no start and end date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      const result = testee.getTimestampsOfDaylies()
      expect(result).to.be.empty
    })
  })

  describe('#getFirstDailyForEventlist', function () {
    it('has to return null for empty event list and no start date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      expect(testee.getFirstDailyForEventlist()).to.be.null
    })
  })

  describe('#getFirstDailyForEventlist', function () {
    it('has to return null for empty event list and no start date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      expect(testee.getFirstDailyForEventlist()).to.be.null
    })

    it('has to return the time of the daily before the start date for an empty event list', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      testee.startAtDate = Date.parse('2021-10-21 12:00 GMT')
      expect(testee.getFirstDailyForEventlist()).to.be.equal(Date.parse('2021-10-21 7:00 UTC'))
    })

    it('has to return the time of the daily teh day before the start date, if the start time is before the daily', function () {
        const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
        testee.startAtDate = Date.parse('2021-10-21 6:00 GMT')
        expect(testee.getFirstDailyForEventlist()).to.be.equal(Date.parse('2021-10-20 7:00 UTC'))
    })

    it('has to return the time of the daily before the first event', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [new StatusChangedEvent('id', 'work', Date.parse('2021-10-21 12:00'))])
      expect(testee.getFirstDailyForEventlist()).to.be.equal(Date.parse('2021-10-21 7:00 UTC'))
    })

    it('has to ignore events before the start date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [new StatusChangedEvent('id', 'work', Date.parse('2021-10-21 12:00'))])
      testee.startAtDate = Date.parse('2021-10-22 12:00 GMT')
      expect(testee.getFirstDailyForEventlist()).to.be.equal(Date.parse('2021-10-22 7:00 UTC'))
    })
  })


  describe('#getLastDailyForEventlist', function () {
    it('has to return null for empty event list and no end date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      expect(testee.getLastDailyForEventlist()).to.be.null
    })

    it('has to return the time of the daily after the start date for an empty event list', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
      testee.endAtDate = Date.parse('2021-10-21 5:00 GMT')

      expect(testee.getLastDailyForEventlist()).to.be.equal(Date.parse('2021-10-21 7:00 UTC'))
    })

    it('has to return the time of the daily the day after the end date, if the end time is after the daily', function () {
        const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [])
        testee.endAtDate = Date.parse('2021-10-21 12:00 GMT')
        expect(testee.getLastDailyForEventlist()).to.be.equal(Date.parse('2021-10-22 7:00 UTC'))
    })

    it('has to return the time of the daily after the first event', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [new StatusChangedEvent('id', 'work', Date.parse('2021-10-21 12:00'))])
      expect(testee.getLastDailyForEventlist()).to.be.equal(Date.parse('2021-10-22 7:00 UTC'))
    })

    it('has to ignore events after the start date', function () {
      const testee = new CfdAnalyzer([['todo'], ['work'], ['done']], [new StatusChangedEvent('id', 'work', Date.parse('2021-10-22 12:00'))])
      testee.endAtDate = Date.parse('2021-10-21 6:00 GMT')
      expect(testee.getLastDailyForEventlist()).to.be.equal(Date.parse('2021-10-21 7:00 UTC'))
    })
  })
})
