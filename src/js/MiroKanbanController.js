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
    }]).then(data => console.log(data))
  }

  async getCsvData () {
    const $this = this
    return await $this.miro.board.widgets.get({ type: 'CARD' })
      .then(function (data) {
        return 'cardId;new state;timestamp;\n' +
          data.map(card => MiroTextHelper.extractEventList(card.description, card.id))
            .map(eventList => eventList.toCSV())
            .join('') +
          '\n\n\n\ncardId;title;\n' +
          data.map(card => card.id + ';' + $this.removeParagraph(card.title) + ';\n').join('')
      }
      )
  }

  removeParagraph (text) {
    return text.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<br />', '')
  }
}

module.exports = MiroKanbanController
