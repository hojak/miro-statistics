/* global alert */

const KanbanTargetShapeList = require('./KanbanTargetShapeList')
const MiroTextHelper = require('./MiroTextHelper')
const Point = require('./Point')

const icon = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"></circle>'

class MiroKanbanController {
  constructor (miro) {
    this.miro = miro

    this.initializeMiroHandlers()
  }

  initializeMiroHandlers () {
    const $this = this
    this.miro.onReady(() => {
      $this.miro.initialize({
        extensionPoints: {
          bottomBar: async () => {
            const authorized = await $this.miro.isAuthorized()

            if (authorized) {
              this.initializeKanbanShapes()

              this.registerEventHandler()

              return {
                title: 'Authorized example',
                svgIcon: icon,
                onClick: this.handleButtonClick
              }
            } else {
              return $this.miro.authorize({
                response_type: 'code'
              }).then(() => {
                return {
                  title: 'Authorized example',
                  svgIcon: icon,
                  onClick: this.handleButtonClick
                }
              })
            }
          }
        }
      })
    })
  }

  initializeKanbanShapes () {
    const $this = this
    KanbanTargetShapeList.createFromMiroBoard()
      .then(shapes => {
        $this.kanbanShapes = shapes
      })
  }

  registerEventHandler () {
    const $this = this
    $this.miro.addListener(
      $this.miro.enums.event.WIDGETS_TRANSFORMATION_UPDATED,
      event => $this.miroTranformationListener(event)
    )
  }

  miroTranformationListener (event) {
    const $this = this

    const eventSubject = event.data[0]
    if (eventSubject.type === 'CARD') {
      $this.miro.board.widgets.get({ id: eventSubject.id })
        .then(cardWidget => $this.handleTranformedCardWidget(cardWidget))
    }
  }

  handleTranformedCardWidget (cardWidgetData) {
    const kanbanShape = this.kanbanShapes.findMatchingShape(new Point(cardWidgetData[0].bounds.x, cardWidgetData[0].bounds.y))

    if (kanbanShape) {
      this.updateKanbanMetrics(cardWidgetData, kanbanShape)
    }
  }

  updateKanbanMetrics (cardWidgetData, kanbanShape) {
    this.miro.board.widgets.update([{
      id: cardWidgetData[0].id,
      description: MiroTextHelper.registerStatusChange(
        cardWidgetData[0].description,
        cardWidgetData[0].id,
        kanbanShape.name
      )
    }]).then(data => console.log(data))
  }

  handleButtonClick () {
    alert('Bauhaus kanban metrics app. - Create a shape with a [<name>], move cards over it and enjoy the magic!')
  }
}

module.exports = MiroKanbanController
