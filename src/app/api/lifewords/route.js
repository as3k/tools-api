import lifewords from "../../../utils/lifewords.json"
import { corsJson } from "../_lib/cors"

const DEFAULT_COUNT = 1

const pickRandomWords = count => {
  const pool = [...lifewords]
  const selection = []

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(Math.random() * pool.length)
    selection.push(pool.splice(index, 1)[0])
  }

  return selection
}

const parseCount = value => {
  if (!value) return DEFAULT_COUNT

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) return DEFAULT_COUNT

  return Math.min(parsed, lifewords.length)
}

const methodNotAllowed = () =>
  corsJson({ error: "Method Not Allowed" }, { status: 405, headers: { Allow: "GET" } })

export const GET = request => {
  const count = parseCount(request.nextUrl.searchParams.get("count"))
  return corsJson(pickRandomWords(count))
}

export const POST = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
export const HEAD = methodNotAllowed
export const OPTIONS = methodNotAllowed
