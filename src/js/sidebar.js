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
    console.log(columnDefinitions)

    controller.getChronologicalEventList().then(
      data => {
        console.log(data.map(element => new Date ( element.timestamp).toLocaleString()))

        const listOfDailyTimestamps = getCfdTimestamps(data)
        const cfdData = createCfdData(columnDefinitions, listOfDailyTimestamps, data)

        showCfd(columnDefinitions, listOfDailyTimestamps.map(ts => new Date ( ts ).toLocaleString()), cfdData)
      }
    )
  }
}

function createCfdData (columnDefinition, listOfDailyTimestamps, eventList) {
  var indexOfNextDaily = 0

  var currentStatus = columnDefinition.map(item => 0);
  var cardStates = {}

  var statusName2ColumnNumber = {}
  columnDefinition.forEach((columns, index ) => {
    columns.forEach ( column => statusName2ColumnNumber[column] = index )
  });

  var dailyCardNumbers = []
  eventList.forEach ( event => {
    while ( event.getTimestamp() > listOfDailyTimestamps[indexOfNextDaily] && indexOfNextDaily < listOfDailyTimestamps.length ) {
      dailyCardNumbers.push ( [...currentStatus] )
      indexOfNextDaily++;
    }

    if ( event.getObjectId() in cardStates ) {
      currentStatus[cardStates[event.getObjectId()]] --
      delete ( cardStates[event.getObjectId()])
    }

    if ( event.getNewStatus() in statusName2ColumnNumber ) {
      cardStates[event.getObjectId()] = statusName2ColumnNumber[event.getNewStatus()]
      currentStatus[cardStates[event.getObjectId()]]++
    }
  })

  console.log ( "resulting array")
  console.log ( dailyCardNumbers )

  // transponse
  var result = transpose ( dailyCardNumbers );

  console.log ( "transposed array")
  console.log ( result )

  return result
}

function transpose(array) {
  return array.reduce((prev, next) => next.map((item, i) =>
      (prev[i] || []).concat(next[i])
  ), []);
}


const hourOfDaily = 9
const minuteOfDaily = 0

function getFirstDailyForEventlist (eventList) {
  const timeOfFirstEvent = eventList[0].getTimestamp()

  const startDate = new Date(timeOfFirstEvent)
  startDate.setHours(hourOfDaily)
  startDate.setMinutes(minuteOfDaily)
  startDate.setSeconds(0)
  startDate.setMilliseconds(0)
  if (startDate.getTime() < timeOfFirstEvent) {
    startDate.setDate(startDate.getDate() - 1)
  }

  return startDate.getTime()
}

function getLastDailyForEventlist (eventList) {
  const timeOfFirstEvent = eventList[eventList.length - 1].getTimestamp()

  const endDate = new Date(timeOfFirstEvent)
  endDate.setHours(hourOfDaily)
  endDate.setMinutes(minuteOfDaily)
  endDate.setSeconds(0)
  endDate.setMilliseconds(0)

  if (endDate.getTime() > timeOfFirstEvent) {
    endDate.setDate(endDate.getDate() + 1)
  }

  return endDate.getTime()
}

function getCfdTimestamps (eventList) {
  const timestampOfFirstDaily = getFirstDailyForEventlist(eventList)
  const timestampOfLastDaily = getLastDailyForEventlist(eventList)

  const result = []
  for (let currentTimestampOfDaily = timestampOfFirstDaily; currentTimestampOfDaily <= timestampOfLastDaily; currentTimestampOfDaily += 24 * 3600 * 1000) {
    result.push(currentTimestampOfDaily)
  }

  return result
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
    getJsCodeForLabelsAndData(dataRowLabels.map ( line => line.join (", ")), columnLabels, data) + '</body>'
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
