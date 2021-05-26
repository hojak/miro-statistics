var assert = require('assert');

const { expect } = require('chai');
const StatusChangedEvent = require('../../src/htdocs/js/StatusChangedEvent');

describe('StatusChangedEvent', function() {
  
  describe('#constructor()', function() {
    it('must be filled with current timestamp by default', function() {
        const before = new Date();
        const testee = new StatusChangedEvent( 'some_id', 'new status' );
        const after = new Date();

        expect(testee.getTimestamp()).to.be.greaterThanOrEqual ( before );
        expect(testee.getTimestamp()).to.be.lessThanOrEqual ( after );
    });
  });


  describe('#constructor()', function() {
    it('has to use the given timestamp', function() {
        const before = new Date();
        const testee = new StatusChangedEvent( 'some_id', 'new status', 1000);
        const after = new Date();

        expect(testee.getTimestamp()).to.be.equal ( 1000 );
    });
  });


  describe ('conflicts()', function () {
    it ('has to be true for same id and status', function () {
      [
        [new StatusChangedEvent ( 'id', 'item', 10 ), new StatusChangedEvent('id', 'item', 100)],
        [new StatusChangedEvent ( 'id', 'item', 10 ), new StatusChangedEvent('id', 'item', 10)],
        [new StatusChangedEvent ( '', 'item', 10 ), new StatusChangedEvent('', 'item', 100)],
      ].forEach ( function ( pair) {
        expect ( pair[0].conflicts(pair[1])).is.true;
      });
    });

    it ( 'has to be false when id or status are different', function () {
      [
        [new StatusChangedEvent ( 'id', 'item', 10 ), new StatusChangedEvent('id', 'other item', 10)],
        [new StatusChangedEvent ( 'id', 'item', 10 ), new StatusChangedEvent('other id', 'item', 10)],
        [new StatusChangedEvent ( '', 'item', 10 ), new StatusChangedEvent('id', 'item', 100)],
        [new StatusChangedEvent ( 'id', 'item', 10 ), new StatusChangedEvent('id', '', 100)],
      ].forEach ( function ( pair ) {
        expect ( pair[0].conflicts(pair[1])).is.false;
      });
    });
  });



});