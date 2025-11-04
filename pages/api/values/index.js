// API route that returns values cards, either random or targeted by set and index, so
// clients can display the prompt category alongside card metadata.
// Example (random): GET /api/values → { "cards": [{ "value": "Kindness", "index": 3, ... }] }
// Example (specific): GET /api/values?value=Kindness&index=7
// Example (count): GET /api/values?value=Respect&count=3
const { allowCors, randomItem } = require("../util")
const cardSets = require("./cards.json")

const handler = (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." })
  }

  const { value, index, count } = req.query
  const normalizeParam = param => (Array.isArray(param) ? param[0] : param)
  const valueParam = normalizeParam(value)
  const indexParam = normalizeParam(index)

  if (indexParam !== undefined && !valueParam) {
    return res.status(400).json({ error: "Specify both value and index to fetch a specific card." })
  }

  const countParam = normalizeParam(count)
  const parsedCount = countParam !== undefined ? Number.parseInt(countParam, 10) : 1
  if (Number.isNaN(parsedCount) || parsedCount <= 0) {
    return res.status(400).json({ error: "Count must be a positive number." })
  }

  let selectedSet
  if (valueParam) {
    selectedSet = cardSets.find(set => set.set.toLowerCase() === valueParam.toLowerCase())
    if (!selectedSet) {
      return res.status(404).json({ error: `No value set found for '${valueParam}'.` })
    }
  }

  const pickCard = () => {
    if (indexParam !== undefined) {
      const parsedIndex = Number.parseInt(indexParam, 10)
      if (Number.isNaN(parsedIndex)) {
        throw new Error("Index must be a number.")
      }
      const valueSet = selectedSet
      const foundCard = valueSet.cards.find(card => card.index === parsedIndex)
      if (!foundCard) {
        throw new Error(`No card with index '${parsedIndex}' found in value '${valueSet.set}'.`)
      }
      return { set: valueSet, card: foundCard }
    }
    const valueSet = selectedSet ?? randomItem(cardSets)
    const card = randomItem(valueSet.cards)
    return { set: valueSet, card }
  }

  try {
    const cards = Array.from({ length: parsedCount }, () => {
      const { set, card } = pickCard()
      return {
        value: set.set,
        index: card.index,
        type: card.type,
        text: card.text,
      }
    })

    return res.status(200).json({ cards })
  } catch (error) {
    const status = error.message.includes("No card with index") ? 404 : 400
    return res.status(status).json({ error: error.message })
  }
}

const wrappedHandler = allowCors(handler)

module.exports = wrappedHandler
module.exports.default = wrappedHandler
