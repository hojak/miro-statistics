const chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;

const MiroTextHelper = require('../../src/htdocs/js/MiroTextHelper');

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


});


