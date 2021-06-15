const chai = require('chai');
const expect = chai.expect;

const Point = require('../../src/js/Point');

describe('Point', function() {
    describe ( '#constructor', function () { 
        it ( "has to store the given x-coordinate", function () {
            expect (new Point ( 10.5, 11.0).X).to.be.equal ( 10.5);
        });

        it ( "has to store the given y-coordinate", function () {
            expect (new Point ( 10.5, 11.0).Y).to.be.equal ( 11);
        });

        it ( "has to reject non numbers", function () {
            expect ( function () { new Point ( 'hallo', 10) }).to.throw ( TypeError );
            expect ( function () { new Point ( 20, 'hallo')}).to.throw ( TypeError );
            expect ( function () { new Point ( null, 10)}).to.throw ( TypeError );
            expect ( function () { new Point ( 10, null)}).to.throw ( TypeError );
        });

        it ( "has to accept 0", function () {
            let testee = new Point ( 0,0);
            expect ( testee.X).to.be.equal ( 0);
            expect ( testee.Y).to.be.equal ( 0);
        });
    }); 
})