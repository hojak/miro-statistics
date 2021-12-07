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

    it('has to return undefined if no matching shape is present', function () {
      const testList = new KanbanTargetShapeList([
        new KanbanTargetShape('notMatchingID', 'not matching Name', new Point(20, 20), new Point(30, 30)),
        new KanbanTargetShape('matchingID', 'matching Name', new Point(0, 0), new Point(10, 10))
      ])

      expect(testList.findMatchingShape(new Point(100, 100))).to.be.equal(undefined)
    })
  })

  describe('#updateOrAddShape', function () {
    it('has to add a new shape, if the old id is not present', function () {
      const testList = new KanbanTargetShapeList([
        new KanbanTargetShape('firstItem', 'some kanban name', new Point(20, 20), new Point(30, 30)),
        new KanbanTargetShape('secodItem', 'some other kanban name', new Point(0, 0), new Point(10, 10))
      ])

      expect(testList.Items.length).to.be.equal(2)
      expect(testList.Items.find(item => { return item.MiroID === 'firstItem' }).Name).to.be.equal('some kanban name')

      testList.updateOrAddShape(new KanbanTargetShape('a 3rd item', 'some kanban name', new Point(20, 20), new Point(30, 30)))

      expect(testList.Items.length).to.be.equal(3)
    })

    it('has to update the existing shape, if a matching id is present', function () {
      const testList = new KanbanTargetShapeList([
        new KanbanTargetShape('firstItem', 'some kanban name', new Point(20, 20), new Point(30, 30)),
        new KanbanTargetShape('secodItem', 'some other kanban name', new Point(0, 0), new Point(10, 10))
      ])

      testList.updateOrAddShape(new KanbanTargetShape('firstItem', 'some new name', new Point(20, 20), new Point(30, 30)))

      expect(testList.Items.length).to.be.equal(2)
      expect(testList.Items.find(item => item.MiroID === 'firstItem').Name).to.be.equal('some new name')
    })
  })
})
