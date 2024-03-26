const { expect } = require('chai')
const StatusChangedEventFactory = require('../../src/js/StatusChangedEventFactory')
const StatusChangedEvent = require('../../src/js/StatusChangedEvent')
const StatusChangedEventDummy = require('../../src/js/StatusChangedEventDummy')

describe('StatusChangedEventFactory', function () {
  describe('#createFromMiroString', function () {
    it('has to parse status and date', function () {
      const timestamp = '2020-05-12 22:27'
      const status = 'working'
      const id = 'testid'

      const testee = StatusChangedEventFactory.createFromMiroString(status + ': ' + timestamp, id)

      expect(testee.objectId).to.be.equal(id)
      expect(testee.newStatus).to.be.equal(status)
      expect(StatusChangedEvent.formatTimeStamp(testee.timestamp)).to.be.equal(timestamp)
    })
  })
  describe('#createFromMiroStringForDummy', function () {
    it('has to parse status and date', function () {
      const timestamp = 'yyyy-mm-dd HH:mm'
      const status = 'working'
      const id = 'testid'

      const testee = StatusChangedEventFactory.createFromMiroString(status + ': ' + timestamp, id)

      expect(testee).to.be.instanceOf(StatusChangedEventDummy)
      expect(testee.objectId).to.be.equal(id)
      expect(testee.newStatus).to.be.equal(status)
    })
  })
})
