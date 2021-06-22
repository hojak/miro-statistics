const { fail } = require('assert')

const { expect } = require('chai')
const ItemEventList = require('../../src/js/ItemEventList')
const StatusChangedEvent = require('../../src/js/StatusChangedEvent')

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

      expect ( () => testee.addEvent('test') )
        .to.throw(Error)
        // todo: check error message
        //.withErrorMessage (ItemEventList.ERROR_NOT_AN_EVENT)
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
          .addEvent(new StatusChangedEvent('id', 'finished', 200))

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

    it('has to generate an empty list', function () {
      expect(ItemEventList.createFromMiroString('').getSize()).to.be.equal(0)
    })

    it('has to use the object id for each event', function () {
      const objectId = 'objectId'
      const testee = ItemEventList.createFromMiroString('work: 2021-07-10 10:00,\nactive: 2021-08-10 11:00', objectId)

      testee.getItems().forEach(event => {
        expect(event.objectId).to.be.equal(objectId)
      })
    })
  })
})
