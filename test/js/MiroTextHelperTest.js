const chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;

const MiroTextHelper = require('../../src/js/MiroTextHelper');
const ItemEventList = require('../../src/js/ItemEventList');
const { fail, doesNotMatch } = require('assert');
const StatusChangedEvent = require('../../src/js/StatusChangedEvent');

describe('MiroTextHelper', function() {
    describe ( '#extractEventList', function () {
        it ('should extract an empty list', function () {
            expect (MiroTextHelper.extractEventList('lorem ipsum').getSize()).to.be.equal ( 0 );
        });

        it ('should extract a simple list from the middle', function () {
            const text = 
                "lorem impsum und so weiter\n\n" 
                + MiroTextHelper.START_EVENT_LIST + "work: 2020-10-01 17:00" + MiroTextHelper.END_EVENT_LIST
                + "and some more text";

            const objectId = "objectId";
            const extracted = MiroTextHelper.extractEventList(text, objectId);
            
            expect ( extracted.getSize()).to.be.equal(1);
            expect (extracted.getItems()[0].newStatus).to.be.equal ("work");
            expect (extracted.getItems()[0].objectId).to.be.equal ( objectId);
        });

    });

    describe('#registerStatusChange', function () {
        it ( 'has to add a text representation at the end', function () {
            const sometext = 'Lorem ipsum und so weiter';
            const newStatus = 'work';
            const obectId = 'someId';
            const newText = MiroTextHelper.registerStatusChange ( sometext, "itemId", "work" );
            expect ( newText  )
                .to.startsWith ( sometext)
                .and.to.contain( MiroTextHelper.START_EVENT_LIST)
                .and.to.contain( MiroTextHelper.END_EVENT_LIST)
                .and.to.contain( "work");
        });

        it ( 'has to throw an error, if a status is added twice', function () {
            const now = new Date();
            const itemId = "itemId";
            const preparredList = new ItemEventList()
                .addEvent( new StatusChangedEvent(itemId, "selected", new Date( now.getTime() - 7200000)))
                .addEvent( new StatusChangedEvent(itemId, "work", new Date( now.getTime() - 3600000)));
            const before = "something before";
            let prepared = MiroTextHelper.replaceEventList (before, preparredList);

            try {
                MiroTextHelper.registerStatusChange (prepared, itemId, "work");
                fail ( "exception expected");
            } catch ( error ) {
                expect ( error ).to.be.equal ( ItemEventList.ERROR_NEIGHBOR_CONFLICT );
            }
        });
    });

    describe('#getEventlistRepresentation', function () {
        it ( 'has to embed a list representation into the miro delimiters', function () {
            [
                "",
                "work: 2020-01-10 01:15"
            ].forEach ( listString => {
                expect ( MiroTextHelper.getEventlistRepresentation( ItemEventList.createFromMiroString(listString)))
                    .to.be.equal ( MiroTextHelper.START_EVENT_LIST + listString + MiroTextHelper.END_EVENT_LIST);
            });
        });
    });


    describe('#removeEventList', function () {
        it ( 'has to remove the item list from the input', function () {
            let before = "before";
            let after = "after";
            let testString = before + MiroTextHelper.START_EVENT_LIST + "some interesting to be removed" + MiroTextHelper.END_EVENT_LIST + after;
            expect ( MiroTextHelper.removeEventList( testString)).to.be.equal ( before + after );
        });
    });



    describe('#textIsShapeMarker', function () {
        it ('has to dismiss not matching texts', function () {
            [
                MiroTextHelper.START_SHAPE_MARKER + 'End is missing',
                'start is missing' + MiroTextHelper.END_SHAPE_MARKER,
                MiroTextHelper.START_SHAPE_MARKER + 'some text' + MiroTextHelper.END_SHAPE_MARKER + 'something at the end',
                'something at the beginning ' + MiroTextHelper.START_SHAPE_MARKER + 'some text' + MiroTextHelper.END_SHAPE_MARKER,
            ].forEach ( text => expect(MiroTextHelper.textIsShapeMarker ( text )).is.false)
        });

        it ( 'has to ignore whitespaces at start and end', function () {
            [
                " \n " + MiroTextHelper.START_SHAPE_MARKER + 'some text' + MiroTextHelper.END_SHAPE_MARKER + '  '
            ].forEach ( text => expect(MiroTextHelper.textIsShapeMarker ( text )).is.true)
        });

        it ('has to match multiple words as names', function () {
            [
                MiroTextHelper.START_SHAPE_MARKER + 'longer name' + MiroTextHelper.END_SHAPE_MARKER
            ].forEach ( text => expect(MiroTextHelper.textIsShapeMarker ( text )).is.true)
        });
    })
});


