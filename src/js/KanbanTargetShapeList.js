/* global miro */

const Point = require('./Point')
const KanbanTargetShape = require('./KanbanTargetShape')
const MiroTextHelper = require('./MiroTextHelper')

class KanbanTargetShapeList {
  static async createFromMiroBoard () {
    return await miro.board.widgets.get({ type: 'shape' })
      .then(data => new KanbanTargetShapeList(data
        .filter(shape => MiroTextHelper.textIsShapeMarker(shape.plainText))
        .map(KanbanTargetShape.createFromMiroShape)
      ))
  }

  constructor (items) {
    if (!items) {
      items = []
    }
    if (!Array.isArray(items)) {
      throw new TypeError('not an array but ' + typeof (items) + ' items: ' + items)
    }
    items.forEach(item => {
      if (!(item instanceof KanbanTargetShape)) {
        throw new TypeError('not a KanbanTargetShape')
      }
    })

    this.items = items
  }

  addShape (shape) {
    if (!(shape instanceof KanbanTargetShape)) {
      throw new TypeError('not a KanbanTargetShape')
    }

    this.items.push(shape)

    return this
  }

  updateOrAddShape (shape) {
    const found = this.items.find(item => item.MiroID === shape.MiroID)

    if (found) {
      this.items = this.items.filter(item => item.MiroID !== shape.MiroID)
      this.items.push(shape)
    } else {
      this.items.push(shape)
    }

    return this
  }

  findMatchingShape (point) {
    if (!(point instanceof Point)) {
      throw new TypeError('not a Point!')
    }

    return this.items.filter(item => item.isInside(point))[0]
  }

  get Items () { return this.items }
}

module.exports = KanbanTargetShapeList
