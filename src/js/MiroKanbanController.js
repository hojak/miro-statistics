const MiroTextHelper = require('./MiroTextHelper')
class MiroKanbanController {
  constructor (miro) {
    this.miro = miro
  }

  updateKanbanMetrics (cardWidgetData, kanbanShape) {
    this.miro.board.widgets.update([{
      id: cardWidgetData[0].id,
      description: MiroTextHelper.registerStatusChange(
        cardWidgetData[0].description,
        cardWidgetData[0].id,
        kanbanShape.name
      )
    }])
  }

  async getCsvData () {
    const $this = this
    return await $this.miro.board.widgets.get({ type: 'CARD' })
      .then(function (data) {
        return 'cardId;new state;timestamp;\n' +
          data.map(card => MiroTextHelper.extractEventList(card.description, card.id))
            .flatMap(eventList => eventList.getItems())
            .sort ( (eventA, eventB ) => eventA.getTimestamp() - eventB.getTimestamp())
            .map(event => event.toCSV())
            .join('') +
          '\n\n\n\ncardId;title;\n' +
          data.map(card => card.id + ';' + $this.removeHtml(card.title) + ';'
        ).join('\n')
      }
      )
  }

  removeHtml (text) {
    return text
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('<br />', '')
      .replaceAll('<br>', '')
      .replaceAll('&amp;', '&')
      .replaceAll('&gt;', '>')
      .replaceAll ('&lt;', '<')
  }


  showCfd () {
    var htmlContent = null
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", 'cfd.html', false)
    xmlhttp.send();
    if (xmlhttp.status==200) {
      htmlContent = xmlhttp.responseText
    } else {
      htmlContent = "<html><body>Error</body></html>"
    }

    htmlContent = htmlContent.replace('</body>', '<pre>data = [100,200,300]</pre></body>');

    const urlContent = URL.createObjectURL(
        new Blob([htmlContent], { type: "text/html" })
    );

    const win = window.open( urlContent, "_blank" )
  }

}

module.exports = MiroKanbanController
