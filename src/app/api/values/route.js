import { corsJson, corsPreflight } from "../_lib/cors"
import { randomItem } from "../_lib/random"
import cardSets from "./cards.json"

export const runtime = "nodejs"

const normalize = value => {
  if (value === null) return undefined
  return value
}

export const OPTIONS = () => corsPreflight()

export const GET = request => {
  const { searchParams } = new URL(request.url)
  const valueParam = normalize(searchParams.get("value"))
  const indexParam = normalize(searchParams.get("index"))
  const countParam = normalize(searchParams.get("count"))

  if (indexParam !== undefined && !valueParam) {
    return corsJson({ error: "Specify both value and index to fetch a specific card." }, { status: 400 })
  }

  const parsedCount = countParam !== undefined ? Number.parseInt(countParam, 10) : 1
  if (Number.isNaN(parsedCount) || parsedCount <= 0) {
    return corsJson({ error: "Count must be a positive number." }, { status: 400 })
  }

  let selectedSet
  if (valueParam) {
    selectedSet = cardSets.find(set => set.set.toLowerCase() === valueParam.toLowerCase())
    if (!selectedSet) {
      return corsJson({ error: `No value set found for '${valueParam}'.` }, { status: 404 })
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

    return corsJson({ cards })
  } catch (error) {
    const status = error.message.includes("No card with index") ? 404 : 400
    return corsJson({ error: error.message }, { status })
  }
}
