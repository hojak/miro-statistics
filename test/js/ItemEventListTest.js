var assert = require('assert');

const { expect } = require('chai');
const ItemEventList = require('../../src/htdocs/js/ItemEventList');

describe('ItemEventList', function() {
  
  describe('#constructor()', function() {
    it('has to create an empty list', function() {
        const testee = new ItemEventList();
        expect(testee.getSize()).to.be.equal(0);
    });
  });

});