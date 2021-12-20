/* global miro */
/* global XMLHttpRequest */
/* global Blob */

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
    const columnDefinitions = document.getElementById('cfd_groups').value.split('\n').map(entry => entry.split(','))

    const filterBefore = getBeforeTimestamp()
    const filterAfter = getAfterTimestamp()

    console.log(filterBefore)
    console.log(new Date(filterBefore))
    console.log(filterAfter)
    console.log(new Date(filterAfter))

    controller.getChronologicalEventList().then(
      data => {
        console.log('before filter')
        console.log(data)
        if (filterBefore) {
          data = data.filter(item => item.getTimestamp() >= filterBefore)
        }
        if (filterAfter) {
          data = data.filter(item => item.getTimestamp() <= filterAfter)
        }
        console.log('after filter')
        console.log(data)

        const listOfDailyTimestamps = getCfdTimestamps(data)
        const cfdData = createCfdData(columnDefinitions, listOfDailyTimestamps, data)

        showCfd(columnDefinitions, listOfDailyTimestamps.map(ts => new Date(ts).toLocaleString()), cfdData)
      }
    )
  }
}

function getTimstampFromInput (htmlId) {
  const input = document.getElementById(htmlId).value
  if (!input) {
    return null
  } else {
    return Date.parse(input)
  }
}

function getBeforeTimestamp () {
  return getTimstampFromInput('start_date')
}

function getAfterTimestamp () {
  return getTimstampFromInput('end_date')
}

function showCfd (dataRowLabels, columnLabels, data) {
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
    getJsCodeForLabelsAndData(dataRowLabels.map(line => line.join(', ')), columnLabels, data) + '</body>'
  )

  const urlContent = URL.createObjectURL(
    new Blob([htmlContent], { type: 'text/html' })
  )

  window.open(urlContent, '_blank')
}

function getJsCodeForLabelsAndData (dataRowLabels, columnLabels, data) {
  return '<script>' +
    '  dataRowLabels = ' + jsFriendlyJSONStringify(dataRowLabels) + '\n' +
    '  columnLabels = ' + jsFriendlyJSONStringify(columnLabels) + '\n' +
    '  inputData = ' + jsFriendlyJSONStringify(data) + '\n' +
  '</script>'
}

function jsFriendlyJSONStringify (s) {
  return JSON.stringify(s)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
