const { fail } = require('assert')

const { expect } = require('chai')
const { ERROR_NEIGHBOR_CONFLICT } = require('../../src/js/ItemEventList')
const ItemEventList = require('../../src/js/ItemEventList')
const StatusChangedEvent = require('../../src/js/StatusChangedEvent')
const StatusChangedEventTemplate = require('../../src/js/StatusChangedEventTemplate')

describe('ItemEventList', function () {
  describe('#constructor()', function () {
    it('has to create an empty list', function () {
      const testee = new ItemEventList()
      expect(testee.getSize()).to.be.equal(0)
    })
  })

  describe('#addEvent()', function () {
    it('has to include added events into the output', function () {
      [
        new ItemEventList(),
        new ItemEventList().addEvent(new StatusChangedEvent('old', 'test')),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('old', 'test'))
          .addEvent(new StatusChangedEvent('old2', 'new'))
      ].forEach(function (preparedList) {
        const newEvent = new StatusChangedEvent('id', 'changed')
        preparedList.addEvent(newEvent)
        expect(preparedList.getItems()).contains(newEvent)
      })
    })

    it('has to decline non StatusChangedEvent parameters', function () {
      const testee = new ItemEventList()

      expect(() => testee.addEvent('test'))
        .to.throw(Error)
        // todo: check error message
        // .withErrorMessage (ItemEventList.ERROR_NOT_AN_EVENT)
    })

    it('does not allow neighbors with same id and status', function () {
      [
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 1))
          .addEvent(new StatusChangedEvent('id', 'start', 10))
          .addEvent(new StatusChangedEvent('id', 'work', 90))
          .addEvent(new StatusChangedEvent('id', 'finished', 200)),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 1))
          .addEvent(new StatusChangedEvent('id', 'start', 10))
          .addEvent(new StatusChangedEvent('id', 'work', 110))
          .addEvent(new StatusChangedEvent('id', 'finished', 200)),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 1))
          .addEvent(new StatusChangedEventTemplate('id', 'start'))
          .addEvent(new StatusChangedEvent('id', 'work', 110))
          .addEvent(new StatusChangedEventTemplate('id', 'finished')),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 1))
          .addEvent(new StatusChangedEvent('id', 'start', 10))
          .addEvent(new StatusChangedEvent('id', 'work', 110))
          .addEvent(new StatusChangedEventTemplate('id', 'finished')),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 1))
          .addEvent(new StatusChangedEventTemplate('id', 'start'))
          .addEvent(new StatusChangedEvent('id', 'work', 110))
          .addEvent(new StatusChangedEvent('id', 'finished', 200)),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'work', 50)),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'work', 150))

      ].forEach(function (preparedList) {
        try {
          preparedList.addEvent(new StatusChangedEvent('id', 'work', 100))
          fail()
        } catch (error) {
          expect(error).is.equal(ItemEventList.ERROR_NEIGHBOR_CONFLICT)
        }
      })
    })
  })

  describe('#getEvents()', function () {
    it('has to order events by increasing by timestamp', function () {
      [
        new ItemEventList(),
        new ItemEventList()
          .addEvent(new StatusChangedEvent('id', 'new', 100))
          .addEvent(new StatusChangedEvent('id', 'start', 200))
          .addEvent(new StatusChangedEvent('id', 'work', 50))
          .addEvent(new StatusChangedEvent('id', 'finished', 7))
          .addEvent(new StatusChangedEvent('id', 'more work', 110))
          .addEvent(new StatusChangedEvent('id', 'started work', 90))
      ].forEach(function (preparedList) {
        let lastItem = null
        preparedList.getItems().forEach(item => {
          if (lastItem) {
            expect(item.getTimestamp()).is.greaterThanOrEqual(lastItem.getTimestamp())
          }
          lastItem = item
        })
      })
    })
  })

  describe('#toReadableMiroList', function () {
    it('has to print all members', function () {
      const result = new ItemEventList()
        .addEvent(new StatusChangedEvent('id', 'work', new Date()))
        .addEvent(new StatusChangedEvent('id', 'discover', new Date()))
        .addEvent(new StatusChangedEvent('id', 'deliver', new Date()))
        .addEvent(new StatusChangedEvent('id', 'done', new Date()))
        .toReadableMiroList()

      expect(result.split(',')).to.have.length(4)
    })
  })

  describe('#createFromMiroString', function () {
    it('has to create a list', function () {
      [
        '<p>work: 2021-07-10 10:00,</p><p>active: 2021-08-10 11:00</p>',
        '<p>work: 2021-07-10 10:00,</p><p>active: 2021-08-10 11:00,</p><p>done: 2021-08-10 13:00</p>'
      ].forEach(stringRepresentation => {
        expect(
          ItemEventList.createFromMiroString(stringRepresentation, 'someId').toReadableMiroList()
        ).to.be.equal(stringRepresentation)
      })
    })

    it('has to create a list with a template', function () {
      const testee = ItemEventList.createFromMiroString('<p>work: 2021-07-10 10:00,</p><p>active: yyyy-mm-dd hh:mm</p>', 'someId')
      expect(testee.getItems().length).to.be.equal(2)
      expect(ItemEventList.filterTemplateEvents(testee).getItems().length).to.be.equal(1)
    })

    it('has to generate an empty list', function () {
      expect(ItemEventList.createFromMiroString('').getSize()).to.be.equal(0)
    })

    it('has to use the object id for each event', function () {
      const objectId = 'objectId'
      const testee = ItemEventList.createFromMiroString('<p>work: 2021-07-10 10:00,</p><p>active: 2021-08-10 11:00</p>', objectId)

      expect(testee.getItems().length).to.be.equal(2)
      testee.getItems().forEach(event => {
        expect(event.objectId).to.be.equal(objectId)
      })
    })

    it('has to throw an exception for neighbor conflicts', function () {
      const eventlistWithNeighborConflict = '<p>work: 2021-07-10 10:00,</p><p>work: 2021-08-10 11:00,</p><p>done: 2021-08-10 13:00</p>'
      expect(function () { ItemEventList.createFromMiroString(eventlistWithNeighborConflict) }).to.throw(ERROR_NEIGHBOR_CONFLICT)
    })
  })

  describe('#filterEventsBefore', function () {
    it('has to remove events before the given date', function () {
      const initialList = new ItemEventList()
        .addEvent(new StatusChangedEvent('id', 'work', 100000))
        .addEvent(new StatusChangedEvent('id', 'discover', 300000))
        .addEvent(new StatusChangedEvent('id', 'deliver', 200000))
        .addEvent(new StatusChangedEvent('id', 'done', 400000))

      const filteredList = initialList.filterBeforeTimestamp(300000)
      const listOfTimestamps = filteredList.getItems().map(item => item.getTimestamp())

      expect(filteredList.getItems().length).to.be.equal(2)
      expect(listOfTimestamps).to.contain(300000)
      expect(listOfTimestamps).to.contain(400000)
    })
  })

  describe('#filterEventsAfter', function () {
    it('has to remove events before the given date', function () {
      const initialList = new ItemEventList()
        .addEvent(new StatusChangedEvent('id', 'work', 100000))
        .addEvent(new StatusChangedEvent('id', 'discover', 300000))
        .addEvent(new StatusChangedEvent('id', 'deliver', 200000))
        .addEvent(new StatusChangedEvent('id', 'done', 400000))

      const filteredList = initialList.filterAfterTimestamp(200000)
      const listOfTimestamps = filteredList.getItems().map(item => item.getTimestamp())

      expect(filteredList.getItems().length).to.be.equal(2)
      expect(listOfTimestamps).to.contain(100000)
      expect(listOfTimestamps).to.contain(200000)
    })
  })

  describe('#filterTemplateEventsByStatus', function () {
    it('has to remove template events by status', function () {
      const initialList = new ItemEventList()
        .addEvent(new StatusChangedEventTemplate('id', 'work'))
        .addEvent(new StatusChangedEventTemplate('id', 'discover'))
        .addEvent(new StatusChangedEvent('id', 'deliver', new Date()))
        .addEvent(new StatusChangedEvent('id', 'done', new Date()))

      expect(initialList.getItems().length).to.be.equal(4)
      initialList.filterTemplateEventsByStatus('work')

      expect(initialList.getItems().length).to.be.equal(3)
    })
    it('has not to remove non-dummy events by status', function () {
      const initialList = new ItemEventList()
        .addEvent(new StatusChangedEvent('id', 'work', new Date()))
        .addEvent(new StatusChangedEventTemplate('id', 'discover'))
        .addEvent(new StatusChangedEvent('id', 'deliver', new Date()))
        .addEvent(new StatusChangedEvent('id', 'done', new Date()))

      expect(initialList.getItems().length).to.be.equal(4)
      initialList.filterTemplateEventsByStatus('work')

      expect(initialList.getItems().length).to.be.equal(4)
    })
  })
})
