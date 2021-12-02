/* global miro */

const MiroKanbanController = require('./MiroKanbanController')

const controller = new MiroKanbanController(miro)

window.onload = function () {
  document.getElementById('button_export_csv').onclick = function () {
    controller.getCsvData().then(data => {
      const universalBOM = '\uFEFF'
      const csvFile =
      'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + data)
      window.open(csvFile)
    })
  }

  document.getElementById('button_show_cfd').onclick = function () {
    controller.getCsvData().then(data =>
      controller.showCfd(data)
    )
  }
}
