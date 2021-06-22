/* global miro */

const MiroKanbanController = require('./MiroKanbanController')

window.onload = function () {
  // linter hint: without "new", this line fails in the browser...
  new MiroKanbanController(miro)
}
