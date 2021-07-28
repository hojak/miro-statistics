/* global miro */

const MiroKanbanController = require('./MiroKanbanController')

const controller = new MiroKanbanController(miro)

window.onload = function () {
  document.getElementById('button_export_csv').onclick = function () {
    controller.getCsvData().then(data => {
      const csvFile =
            'data:text/csv;charset=utf-8,' + data
      window.open(csvFile)
    })
  }
}
