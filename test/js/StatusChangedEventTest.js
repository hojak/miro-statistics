var assert = require('assert');

const { expect } = require('chai');
const StatusChangedEvent = require('../../src/js/StatusChangedEvent');

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


  describe ('#conflicts()', function () {
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


  describe ('#readableMiroRepresentation', function () {
    it ('has to contain status and timestamp', function () {
      [
        {'id': 'testid', 'status' : 'work', 'timestamp': new Date()}
      ].forEach ( data => {
        const newEvent = new StatusChangedEvent ( data['id'], data ['status'], data ['timestamp']);

        expect ( newEvent.readableMiroRepresentation ).to.be.equal ( 
          data['status'] + ": " + StatusChangedEvent.formatTimeStamp (data['timestamp'])
        )
      });
    });
  });


  describe ('#createFromMiroString', function () {
    it ('has to parse status and date', function () {
      const timestamp = '2020-05-12 22:27';
      const status = 'working';
      const id = 'testid';

      const testee = StatusChangedEvent.createFromMiroString ( status + ": " + timestamp, id);

      expect ( testee.objectId ).to.be.equal ( id );
      expect ( testee.newStatus).to.be.equal ( status );
      expect ( StatusChangedEvent.formatTimeStamp ( testee.timestamp) ).to.be.equal ( timestamp);
    });
  });



});