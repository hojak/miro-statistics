const { expect } = require('chai')
const Point = require('../../src/js/Point')
const KanbanTargetShape = require('../../src/js/KanbanTargetShape')
const KanbanTargetShapeList = require('../../src/js/KanbanTargetShapeList')

describe('KanbanTargetShapeList', function () {
  describe('#constructor', function () {
    it('accept empty lists', function () {
      expect(new KanbanTargetShapeList().Items).to.be.an('array').and.to.have.lengthOf(0)
    })

    it('accept an arbitrary list', function () {
      expect(new KanbanTargetShapeList([
        new KanbanTargetShape('test', 'test', new Point(0, 9), new Point(10, 10)),
        new KanbanTargetShape('test', 'test', new Point(0, 9), new Point(10, 10))
      ]).Items).to.be.an('array').and.to.have.lengthOf(2)
    })

    it('has to accept only KanbarTargetShapes', function () {
      expect(function () {
        KanbanTargetShapeList([
          new KanbanTargetShape('test', 'test', new Point(0, 9), new Point(10, 10)),
          'test'
        ])
      }).to.throw(TypeError)
    })
  })

  describe('#addShape', function () {
    it('has to add a shape to the item list', function () {
      const shape = new KanbanTargetShape('test', 'hallo', new Point(0, 0), new Point(10, 10))

      expect(
        new KanbanTargetShapeList([new KanbanTargetShape('test', 'test', new Point(0, 9), new Point(10, 10))])
          .addShape(shape).Items
      ).to.be.an('array').an.to.contain(shape)
    })

    it('has to reject non KanbanTargetShapes', function () {
      expect(function () {
        new KanbanTargetShapeList().addShape('test')
      }).to.throw(TypeError)
    })
  })

  describe('#findMatchingShape', function () {
    it('has to find the matchig shape', function () {
      const testList = new KanbanTargetShapeList([
        new KanbanTargetShape('notMatchingID', 'not matching Name', new Point(20, 20), new Point(30, 30)),
        new KanbanTargetShape('matchingID', 'matching Name', new Point(0, 0), new Point(10, 10))
      ])
      expect(testList.findMatchingShape(new Point(5, 5)).MiroID).to.be.equal('matchingID')
    })

    it('has only to accept points', function () {
      expect(
        function () { new KanbanTargetShapeList().findMatchingShape('hallo ') }
      ).to.throw(TypeError)
    })
  })
})
