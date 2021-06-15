const { expect } = require('chai')
const Point = require('../../src/js/Point')
const KanbanTargetShape = require('../../src/js/KanbanTargetShape')

describe('KanbanTargetShape', function () {
  describe('#constructor', function () {
    it('has to reject non-points', function () {
      expect(function () { KanbanTargetShape('test', 'test', 'test', new Point(10, 12)) }).to.throw(TypeError)
      expect(function () { KanbanTargetShape('test', 'test', new Point(10, 12), 'wdwqd') }).to.throw(TypeError)
    })

    it('has to store the id', function () {
      const testID = 'testId'
      expect(new KanbanTargetShape(testID, 'unimportant', new Point(0, 0), new Point(0, 0)).MiroID).to.be.equal(testID)
    })

    it('has to store the name', function () {
      const testName = 'some name'
      expect(new KanbanTargetShape('unimportant', testName, new Point(0, 0), new Point(0, 0)).Name).to.be.equal(testName)
    })

    it('has to store the top left coordinate', function () {
      const topLeft = new Point(10, 20)
      expect(new KanbanTargetShape('unimportant', 'unimportant', topLeft, new Point(0, 0)).TopLeft).to.be.equal(topLeft)
    })

    it('has to store the bottom right coordinate', function () {
      const bottomRight = new Point(10, 20)
      expect(new KanbanTargetShape('unimportant', 'unimportant', new Point(0, 0), bottomRight).BottomRight).to.be.equal(bottomRight)
    })
  })

  describe('#isInside', function () {
    it('has to accept this points', function () {
      const testee = new KanbanTargetShape('test', 'test', new Point(5, 5), new Point(20, 20));
      [
        new Point(10, 10),
        new Point(5, 10),
        new Point(5, 20),
        new Point(15, 20),
        new Point(20, 20)
      ].forEach(point =>
        expect(testee.isInside(point)).to.be.true
      )
    })

    it('has to reject this points', function () {
      const testee = new KanbanTargetShape('test', 'test', new Point(5, 5), new Point(20, 20));
      [
        new Point(5, 20.00001),
        new Point(-1, -1),
        new Point(0, 0),
        new Point(27, 15)
      ].forEach(point =>
        expect(testee.isInside(point)).to.be.false
      )
    })
  })
})
