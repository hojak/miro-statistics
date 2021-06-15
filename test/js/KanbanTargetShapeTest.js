const { fail, doesNotMatch } = require('assert');
var assert = require('assert');

const { expect } = require('chai');
const Point = require('../../src/js/Point');
const KanbanTargetShape = require('../../src/js/KanbanTargetShape');

describe('KanbanTargetShape', function() { 
    describe('#constructor', function () {
        it ("has to reject non-points", function () {
            expect ( function () { new KanbanTargetShape("test", "test", "test", new Point ( 10,12))} ).to.throw ( TypeError );
            expect ( function () { new KanbanTargetShape("test", "test", new Point ( 10,12), "wdwqd")} ).to.throw ( TypeError );
        });

        it ("has to store the id", function () {
            const testID = "testId";
            expect ( new KanbanTargetShape(testID, "unimportant", new Point (0,0), new Point ( 0,0)).MiroID).to.be.equal ( testID );
        });

        it ("has to store the name", function () {
            const testName = "some name";
            expect ( new KanbanTargetShape("unimportant", testName, new Point (0,0), new Point ( 0,0)).Name).to.be.equal ( testName );
        });

        it ( "has to store the top left coordinate", function () {
            const topLeft = new Point ( 10, 20);
            expect ( new KanbanTargetShape("unimportant", "unimportant", topLeft, new Point ( 0,0)).TopLeft).to.be.equal ( topLeft );
        });

        it ( "has to store the bottom right coordinate", function () {
            const bottomRight = new Point ( 10, 20);
            expect ( new KanbanTargetShape("unimportant", "unimportant", new Point ( 0,0), bottomRight).BottomRight).to.be.equal ( bottomRight );
        });
    });

});