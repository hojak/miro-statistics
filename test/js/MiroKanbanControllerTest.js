
const { expect, assert } = require('chai')
const Point = require('../../src/js/Point')
const MiroKanbanController = require('../../src/js/MiroKanbanController')
const { ERROR_NEIGHBOR_CONFLICT } = require('../../src/js/ItemEventList')
const { START_EVENT_LIST, END_EVENT_LIST } = require('../../src/js/MiroTextHelper')
const ItemEventList = require('../../src/js/ItemEventList')

describe('MiroKanbanController', function () {

    let miroMock = {}
    const miroKanbanController = new MiroKanbanController(miroMock)

    describe ( 'getAllCardEventlists', function () {
        it('has to return an empty list', function () {
            const cardData = []
            expect ( miroKanbanController.getAllCardEventlists (cardData) ).to.be.empty
        })

        it('must not propagate a neighbor conflict', function () {
            const cardData = [
                {
                    title: 'errorprone card',
                    description:  START_EVENT_LIST + '<p>work: 2021-07-10 10:00,</p><p>work: 2021-08-10 11:00,</p><p>done: 2021-08-10 13:00</p>' + END_EVENT_LIST,
                    id: 123
                },
            ]

            let collectedStrings = "";
            console.log = function ( s ) { collectedStrings += s }
            expect ( miroKanbanController.getAllCardEventlists (cardData)).to.deep.equal ( [new ItemEventList()]) 
            expect ( collectedStrings ).to.contain (cardData[0].title)
        })
    })
})