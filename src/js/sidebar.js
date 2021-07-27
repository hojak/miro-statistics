/* global miro */

const MiroKanbanController = require('./MiroKanbanController')

const controller = new MiroKanbanController(miro)

window.onload = function () {
  document.getElementById('button_export_csv').onclick = function (){
      const csv = controller.getCsvData()
      console.log(csv)
  }  
}
