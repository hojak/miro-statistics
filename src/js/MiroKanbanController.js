/* global XMLHttpRequest */
/* global Blob */

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

  async getAllCards () {
    return await this.miro.board.widgets.get({ type: 'CARD' })
  }

  getEventlistOfCards ( miroCardData ) {
    return miroCardData.map(card => MiroTextHelper.extractEventList(card.description, card.id))
      .flatMap(eventList => eventList.getItems())
      .sort((eventA, eventB) => eventA.getTimestamp() - eventB.getTimestamp())
  }

  async getCsvData () {
    const $this = this
    return await $this.getAllCards ()
      .then(function (data) {
        return 'cardId;new state;timestamp;\n' +
          $this.getEventlistOfCards ( data )
            .map(event => event.toCSV())
            .join('') +
          '\n\n\n\ncardId;title;\n' +
          data.map(card => card.id + ';' + $this.removeHtml(card.title) + ';'
          ).join('\n')
      })
  }

  async getChronologicalEventList () {
    const $this = this
    return await $this.getAllCards().then ( $this.getEventlistOfCards );
  }


  removeHtml (text) {
    return text
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('<br />', '')
      .replaceAll('<br>', '')
      .replaceAll('&amp;', '&')
      .replaceAll('&gt;', '>')
      .replaceAll('&lt;', '<')
  }
}

module.exports = MiroKanbanController
