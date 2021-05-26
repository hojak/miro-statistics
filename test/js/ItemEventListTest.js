const { fail, doesNotMatch } = require('assert');
var assert = require('assert');

const { expect } = require('chai');
const ItemEventList = require('../../src/htdocs/js/ItemEventList');
const StatusChangedEvent = require('../../src/htdocs/js/StatusChangedEvent');

describe('ItemEventList', function() {
  
  describe('#constructor()', function() {
    it('has to create an empty list', function() {
        const testee = new ItemEventList();
        expect(testee.getSize()).to.be.equal(0);
    });
  });


  describe ('#addEvent()', function () {
    it ( 'has to include added events into the output', function () {
        [
            new ItemEventList(),
            new ItemEventList().addEvent( new StatusChangedEvent( 'old', 'test')),
            new ItemEventList()
                .addEvent( new StatusChangedEvent( 'old', 'test'))
                .addEvent (new StatusChangedEvent ('old2', 'new'))
        ].forEach (function ( preparedList ) {
            const newEvent = new StatusChangedEvent( 'id', 'changed');
            preparedList.addEvent ( newEvent );
            expect ( preparedList.getItems()).contains ( newEvent );
        });
    });


    it ('has to decline non StatusChangedEvent parameters', function () {
        const testee = new ItemEventList();

        try {
            testee.addEvent ( 'test');
            fail ()
        } catch ( error ) {
            expect ( error).equals ('IllegalArgument');
        }
    });
  });


});