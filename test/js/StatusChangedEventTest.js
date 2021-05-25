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


});