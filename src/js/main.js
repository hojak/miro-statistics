/* global miro */
/* global alert */

const KanbanTargetShapeList = require('./KanbanTargetShapeList')

const icon = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"></circle>'

miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: async () => {
        const authorized = await miro.isAuthorized()

        if (authorized) {
          initializeMetrics()

          registerEventHandler()

          return {
            title: 'Authorized example',
            svgIcon: icon,
            onClick: sayHi
          }
        } else {
          return miro.authorize({
            response_type: 'code'
          }).then(() => {
            return {
              title: 'Authorized example',
              svgIcon: icon,
              onClick: sayHi
            }
          })
        }
      }
    }
  })
})

function initializeMetrics () {
  KanbanTargetShapeList.createFromMiroBoard()
    .then(shapes => {
      console.log(shapes)
    })
}

function registerEventHandler() {
  miro.addListener(miro.enums.event.WIDGETS_TRANSFORMATION_UPDATED, function ( event ) { 
    eventSubject = event.data[0]
    if ( eventSubject.type == "CARD") {
      miro.board.widgets.get({'id': eventSubject.id})
        .then(cardWidget => {
          console.log( cardWidget )
        })
    }
  } )
}

function sayHi () {
  miro.board.widgets.create({ type: 'sticker', text: 'whatever we want' })
  alert('Hi!')
}
