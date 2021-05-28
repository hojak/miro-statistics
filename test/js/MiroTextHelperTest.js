const chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;

const MiroTextHelper = require('../../src/htdocs/js/MiroTextHelper');
const ItemEventList = require('../../src/htdocs/js/ItemEventList');

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

            const extracted = MiroTextHelper.extractEventList(text);
            
            expect ( extracted.getSize()).to.be.equal(1);
            expect (extracted.getItems()[0].newStatus).to.be.equal ("work");

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
});


