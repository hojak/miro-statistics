
const { expect } = require('chai')
const MiroKanbanController = require('../../src/js/MiroKanbanController')
const { START_EVENT_LIST, END_EVENT_LIST } = require('../../src/js/MiroTextHelper')
const ItemEventList = require('../../src/js/ItemEventList')

describe('MiroKanbanController', function () {
  const miroBoardMock = {}
  const miroKanbanController = new MiroKanbanController(miroBoardMock)

  describe('getAllCardEventlists', function () {
    it('has to return an empty list', function () {
      const cardData = []
      /* eslint-disable no-unused-expressions */
      expect(miroKanbanController.getAllCardEventlists(cardData)).to.be.empty
    })

    it('must not propagate a neighbor conflict', function () {
      const cardData = [
        {
          title: 'errorprone card',
          description: START_EVENT_LIST + '<p>work: 2021-07-10 10:00,</p><p>work: 2021-08-10 11:00,</p><p>done: 2021-08-10 13:00</p>' + END_EVENT_LIST,
          id: 123
        }
      ]

      let collectedStrings = ''
      console.log = function (s) { collectedStrings += s }
      expect(miroKanbanController.getAllCardEventlists(cardData)).to.deep.equal([new ItemEventList()])
      expect(collectedStrings).to.contain(cardData[0].title)
    })
  })

  describe('getStatesOfEventList', function () {
    it('has to return the expected list of states', function () {
      const cardData = [
        {
          title: 'some card',
          description: START_EVENT_LIST + '<p>test: 2021-07-10 10:00,</p><p>work: 2021-08-10 11:00,</p><p>done: 2021-08-10 13:00</p>' + END_EVENT_LIST,
          id: 123
        },
        {
          title: 'another card',
          description: START_EVENT_LIST + '<p>review: 2021-08-10 13:00</p>' + END_EVENT_LIST,
          id: 123
        }
      ]

      const expected = ['done', 'review', 'test', 'work']
      expect(miroKanbanController.getStatesOfEventList(cardData)).to.deep.equal(expected)
    })
  })
})
