/* eslint-disable no-unused-expressions */

const { expect } = require('chai')
const ItemEventList = require('../../src/js/ItemEventList')
const LtdAnalyzer = require('../../src/js/LtdAnalyzer')
const StatusChangedEvent = require('../../src/js/StatusChangedEvent')

describe('LtdAnalyzer', function () {
  describe('#filterEventLists()', function () {
    it('has to return only eventlists ending with a done event', function () {
      const testee = new LtdAnalyzer('done')

      const actual = testee.filterEventLists([
        new ItemEventList([
          new StatusChangedEvent('1', 'todo', 1000),
          new StatusChangedEvent('1', 'done', 2000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('2', 'todo', 1000),
          new StatusChangedEvent('2', 'done', 2000),
          new StatusChangedEvent('2', 'something else', 3000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('3', 'todo', 1000)
        ])
      ])

      expect(actual).has.lengthOf(1)
      expect(actual[0].getItems()[0].getObjectId()).to.be.equal('1')
    })

    it('has to remove cards without events before done', function () {
      const testee = new LtdAnalyzer('done')

      const actual = testee.filterEventLists([
        new ItemEventList([
          new StatusChangedEvent('1', 'todo', 1000),
          new StatusChangedEvent('1', 'done', 2000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('3', 'done', 1000)
        ])
      ])

      expect(actual).has.lengthOf(1)
      expect(actual[0].getItems()[0].getObjectId()).to.be.equal('1')
    })

    it('has to ignore events from the ignore list', function () {
      const testee = new LtdAnalyzer('done', ['ignore'])

      const actual = testee.filterEventLists([
        new ItemEventList([
          new StatusChangedEvent('1', 'ignore', 1000),
          new StatusChangedEvent('1', 'todo', 1000),
          new StatusChangedEvent('1', 'done', 2000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('3', 'ignore', 1000),
          new StatusChangedEvent('3', 'done', 1000)
        ])
      ])

      expect(actual).has.lengthOf(1)
      expect(actual[0].getItems()[0].getObjectId()).to.be.equal('1')
    })
  })

  describe('#orderByLastTimestamp', function () {
    it('has to order events by timestamp of last event', function () {
      const testee = new LtdAnalyzer('done')
      const actual = testee.orderByLastTimestamp([
        new ItemEventList([
          new StatusChangedEvent('1', 'done', 3000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('2', 'done', 1000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('3', 'done', 2000)
        ])
      ])

      expect(actual.map(eventList => eventList.getItems()[0].getObjectId())).to.be.eql(['2', '3', '1'])
    })
  })

  describe('#createLeadTimeMap', function () {
    it('has to count the correct number of days for the lead time', function () {
      const testee = new LtdAnalyzer('done')
      const actual = testee.createLeadTimeMap([
        new ItemEventList([
          new StatusChangedEvent('1', 'todo', 1),
          new StatusChangedEvent('1', 'done', 2 * 24 * 3600 * 1000 + 1000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('2', 'todo', 2 * 24 * 3600 * 1000),
          new StatusChangedEvent('2', 'done', 5 * 24 * 3600 * 1000 + 1000)
        ]),
        new ItemEventList([
          new StatusChangedEvent('3', 'todo', 2 * 24 * 3600 * 1000),
          new StatusChangedEvent('3', 'done', 3 * 24 * 3600 * 1000 - 1000)
        ])
      ])

      expect(actual).to.be.eql({
        1: 3,
        2: 4,
        3: 1
      })
    })
  })
})
