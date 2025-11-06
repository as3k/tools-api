import { corsJson, corsPreflight } from "../../_lib/cors"
import adjectives from "../../_lib/data/adjectives.json"
import laureates from "../../_lib/data/laureates.json"
import { randomItem } from "../../_lib/random"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const GET = () => {
  const nameString = `${randomItem(adjectives)}-${randomItem(laureates)}`
  const username = nameString
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  return corsJson({ username })
}
