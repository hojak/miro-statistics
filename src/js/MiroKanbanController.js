const KanbanTargetShapeList = require('./KanbanTargetShapeList')
const MiroTextHelper = require('./MiroTextHelper')
const Point = require('./Point')

const icon = '<rect style="fill:none;stroke:#000000;stroke-width:0.1" x="1" y="1" height="20" width="6" />' +
  '<rect style="fill:#000000;stroke:#000000;stroke-width:0.001" x="8" y="1" height="14" width="6" />' +
  '<rect style="fill:none;stroke:#000000;stroke-width:0.1" x="15" y="1" height="17" width="6" />'

class MiroKanbanController {
  constructor (miro) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.registerMiroTools()
    })
  }

  async checkAuthorization () {
    const $this = this
    const isAuthorized = await $this.miro.isAuthorized()

    if (!isAuthorized) {
      // Ask the user to authorize the app.
      await $this.miro.requestAuthorization()
    }
  }

  async registerMiroTools () {
    const $this = this

    await $this.checkAuthorization()

    $this.initializeKanbanShapes()
    $this.registerEventHandler()

    $this.miro.initialize({
      extensionPoints: {
        bottomBar: async () => {
          return {
            title: 'Kanban Metrics WebApp',
            svgIcon: icon,
            onClick: () => $this.openSidebar()
          }
        }
      }
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

  async openSidebar () {
    const $this = this
    $this.miro.board.ui.openLeftSidebar('sidebar.html')
  }
}

module.exports = MiroKanbanController
