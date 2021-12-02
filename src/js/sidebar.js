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
    const columnDefinitions = document.getElementById('cfd_groups').value.split("\n").map ( entry => entry.split (','));
    console.log ( columnDefinitions);

    const eventList = controller.getChronologicalEventList().then (
      data => { 
        console.log ( data.map ( element => element.timestamp ))

        const columnLabels = getCfdDates (data)
        const cfdData = createCfdData ( columnDefinitions, columnLabels, data )

        showCfd ( columnDefinitions, columnLabels, cfdData )
      }
    );

  }
}

function createCfdData ( columnDefinition, eventList) {
  return  [
    [1,2,3],
    [0,1,0],
    [2,2,4]
  ]
}

function getCfdDates ( eventList ) {
  return [1,2,3]
}

function showCfd ( dataRowLabels, columnLabels, data ) {
  let htmlContent = null
  const xmlhttp = new XMLHttpRequest()
  xmlhttp.open('GET', 'cfd.html', false)
  xmlhttp.send()
  if (xmlhttp.status === 200) {
    htmlContent = xmlhttp.responseText
  } else {
    htmlContent = '<html><body>Error</body></html>'
  }

  htmlContent = htmlContent.replace(
    '</body>',
    getJsCodeForLabelsAndData ( dataRowLabels, columnLabels, data ) + '</body>'
  )

  const urlContent = URL.createObjectURL(
    new Blob([htmlContent], { type: 'text/html' })
  )

  window.open(urlContent, '_blank')
}

function getJsCodeForLabelsAndData ( dataRowLabels, columnLabels, data ) {
  return '<script>' 
    + '  dataRowLabels = ' +jsFriendlyJSONStringify(dataRowLabels)+ "\n"
    + '  columnLabels = ' + jsFriendlyJSONStringify(columnLabels) + "\n"
    + '  inputData = ' + jsFriendlyJSONStringify(data)+"\n"
  + '</script>'
}


function jsFriendlyJSONStringify (s) {
  return JSON.stringify(s).
      replace(/\u2028/g, '\\u2028').
      replace(/\u2029/g, '\\u2029');
}