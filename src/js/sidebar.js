/* global miro */
/* global XMLHttpRequest */
/* global Blob */

const MiroKanbanController = require('./MiroKanbanController')
const CfdAnalyzer = require('./CfdAnalyzer')
const LtdAnalyzer = require('./LtdAnalyzer')

const controller = new MiroKanbanController(miro)

window.onload = function () {
  addExportCsvClickHandler()

  addShowCfdClickHandler()

  addShowLfdClickHandler()

  initializeCardStatusSelect()


  function initializeCardStatusSelect () {
    // todo
    const listOfStates = ['ready','doing', 'done']

    const select = document.getElementById('card_status')
    select.innerHTML = '';

    listOfStates.forEach( item => {
      var option = document.createElement('option')
      option.innerHTML = item
      select.appendChild(option)
    })
  }


  function addShowLfdClickHandler() {
    document.getElementById('button_show_ltd').onclick = function () {
      controller.getAllCards().then(showLtdForEventList)
    }
  }

  function addShowCfdClickHandler() {
    document.getElementById('button_show_cfd').onclick = function () {
      const columnDefinitions = document.getElementById('cfd_groups').value.split('\n').map(entry => entry.split(','))

      const filterBefore = getBeforeTimestamp()
      const filterAfter = getAfterTimestamp()

      controller.getChronologicalEventList().then(
        data => {
          const cfdAnalyzer = new CfdAnalyzer(columnDefinitions, data)
          if (filterBefore) {
            data = data.filter(item => item.getTimestamp() >= filterBefore)
            cfdAnalyzer.startAtDate = filterBefore
          }
          if (filterAfter) {
            data = data.filter(item => item.getTimestamp() <= filterAfter)
            cfdAnalyzer.endAtDate = filterAfter
          }

          const cfdData = cfdAnalyzer.getCfdData()

          showCfd(columnDefinitions, cfdAnalyzer.getTimestampsOfDaylies().map(ts => new Date(ts).toLocaleString()), cfdData)
        }
      )
    }
  }

  function addExportCsvClickHandler() {
    document.getElementById('button_export_csv').onclick = function () {
      controller.getCsvData().then(data => {
        const universalBOM = '\uFEFF'
        const csvFile = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + data)
        window.open(csvFile)
      })
    }
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

function showLtdForEventList (cardData) {
  const doneColumn = document.getElementById('ltd_done_column').value
  const ignoreColumns = document.getElementById('ltd_ignore_columns').value.split('\n')
  const typeTags = document.getElementById('ltd_type_tags').value.split('\n')

  const ltdAnalyzer = new LtdAnalyzer(doneColumn, ignoreColumns)

  const cardDescriptionMap = controller.getDescriptionMapForCards(cardData, typeTags)
  const cardEventLists = controller.getAllCardEventlists(cardData)

  ltdAnalyzer.setCardDescriptionMap(cardDescriptionMap)

  const ltdData = ltdAnalyzer.getLeadtimeData(cardEventLists)

  let htmlContent = null
  const xmlhttp = new XMLHttpRequest()
  xmlhttp.open('GET', 'ltd.html', false)
  xmlhttp.send()
  if (xmlhttp.status === 200) {
    htmlContent = xmlhttp.responseText
  } else {
    htmlContent = '<html><body>Error</body></html>'
  }

  htmlContent = htmlContent.replace(
    '</body>',
    getJsCodeForLtd(ltdData) + '</body>'
  )

  const urlContent = URL.createObjectURL(
    new Blob([htmlContent], { type: 'text/html' })
  )

  window.open(urlContent, '_blank')
}

function getJsCodeForLtd (ltdData) {
  return '<script>' +
    '  inputData = ' + jsFriendlyJSONStringify(ltdData) + '\n' +
  '</script>'
}
