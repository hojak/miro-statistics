/* global miro */

const MiroKanbanController = require('./MiroKanbanController')

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  new MiroKanbanController(miro)
}
