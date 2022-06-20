/* global miro */
/* global XMLHttpRequest */
/* global Blob */

const MiroKanbanController = require('./MiroKanbanController')
const MiroTextHelper = require('./MiroTextHelper')
const CfdAnalyzer = require('./CfdAnalyzer')
const LtdAnalyzer = require('./LtdAnalyzer')

const controller = new MiroKanbanController(miro)

window.onload = function () {
  addExportCsvClickHandler()

  addShowCfdClickHandler()

  addShowLfdClickHandler()

  addShowCardsOfStatusClickHandler()

  initializeCardStatusSelect()
}


function initializeCardStatusSelect () {
  controller.getAllEventStates().then(listOfStates => {
    const select = document.getElementById('card_status')
    select.innerHTML = ''

    listOfStates.forEach(item => {
      const option = document.createElement('option')
      option.innerHTML = item
      select.appendChild(option)
    })
  })
}

function addShowCardsOfStatusClickHandler () {
  document.getElementById('button_show_cards_in_selected_status').onclick = function () {
    const selectedStatus = document.getElementById('card_status').value

    controller.getAllCards()
      .then(listOfCards => listOfCards.filter(miroCard => isCardInSelectedStatus(miroCard, selectedStatus)))
      .then(showListOfCards)
  }
}

function addShowLfdClickHandler () {
  document.getElementById('button_show_ltd').onclick = function () {
    controller.getAllCards().then(showLtdForEventList)
  }
}

function addShowCfdClickHandler () {
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

function addExportCsvClickHandler () {
  document.getElementById('button_export_csv').onclick = function () {
    controller.getCsvData().then(data => {
      const universalBOM = '\uFEFF'
      const csvFile = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + data)
      window.open(csvFile)
    })
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

function showListOfCards (listOfCards) {
  const listElement = document.getElementById('list_of_cards')

  listElement.innerHTML = ''

  listOfCards.forEach(card => {
    const newEntry = document.createElement('li')
    newEntry.innerHTML = controller.removeHtml(card.title)

    const button = document.createElement('input')
    button.setAttribute('value', 'show')
    button.setAttribute('type', 'button')
    button.onclick = function () { controller.showCard(card.id) }

    newEntry.appendChild(button)

    listElement.appendChild(newEntry)
  })
}

function isCardInSelectedStatus (miroCard, selectedStatus) {
  try {
    const eventList = MiroTextHelper.extractEventList(miroCard.description, miroCard.id)
    return eventList.getSize() > 0 &&
        eventList.items.at(-1).getNewStatus() === selectedStatus
  } catch (error) {
    console.log("Error in Eventlist of '" + miroCard.title + "': " + error)
    return false
  }
}
