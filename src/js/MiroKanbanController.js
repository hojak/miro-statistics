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

  getAllCardEventlists (cardData) {
    return cardData.map(
      card => MiroTextHelper.extractEventList(card.description, card.id)
    )
  }


  getDescriptionForCard (miroCardData, typeTags) {
    const eventList = MiroTextHelper.extractEventList(miroCardData.description, miroCardData.id)
    if (eventList.getItems().length === 0) {
      return null
    }

    const type = this.getTypeOfCard(miroCardData, typeTags)

    return {
      id: miroCardData.id,
      title: this.removeHtml(miroCardData.title),
      timeOfLastEvent: new Date(eventList.getItems().slice(-1)[0].getTimestamp()).toLocaleDateString(),
      type: type
    }
  }

  getTypeOfCard(miroCardData, typeTags) {
    let type = null
    miroCardData.tags.map(tag => tag.title).forEach(
      tag => {
        if (type === null && typeTags.includes(tag)) {
          type = tag
        }
      }
    )
    return type
  }

  getDescriptionMapForCards (cardData, typeTags) {
    const result = {}

    cardData.forEach(
      miroCard => {
        const description = this.getDescriptionForCard(miroCard, typeTags)
        if (description != null) {
          result[description.id] = description
        }
      }
    )

    return result
  }

  getEventlistOfCards (miroCardData) {
    const $this = this
    return $this.getAllCardEventlists(miroCardData)
      .flatMap(eventList => eventList.getItems())
      .sort((eventA, eventB) => eventA.getTimestamp() - eventB.getTimestamp())
  }

  async getCsvData () {
    const $this = this
    return await $this.getAllCards()
      .then(function (data) {
        return 'cardId;new state;timestamp;\n' +
          $this.getEventlistOfCards(data)
            .map(event => event.toCSV())
            .join('') +
          '\n\n\n\ncardId;title;\n' +
          data.map(card => card.id + ';' + $this.removeHtml(card.title) + ';'
          ).join('\n')
      })
  }

  async getChronologicalEventList () {
    const $this = this
    return await $this.getAllCards().then(data => $this.getEventlistOfCards(data))
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
