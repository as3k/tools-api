import { corsJson, corsPreflight } from "../../_lib/cors"
import { generatePassphrase } from "../../_lib/brewphrase"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

const truthy = value => {
  if (value == null) return undefined
  return !["0", "false", "no", "off", ""].includes(String(value).toLowerCase())
}

const parseDigits = value => {
  if (value == null || value === "") return undefined
  const digits = Number.parseInt(value, 10)
  return Number.isFinite(digits) ? digits : undefined
}

const parseSpecialChars = value => {
  if (value == null) return undefined
  if (value === "") return []
  return Array.from(new Set(value.split("")))
}

const capFirstOnly = value => value.charAt(0).toUpperCase() + value.slice(1)

export const GET = request => {
  const { searchParams } = request.nextUrl

  const phrase = generatePassphrase({
    category: searchParams.get("category") ?? undefined,
    template: searchParams.get("template") ?? undefined,
    delimiter: searchParams.get("del") ?? searchParams.get("delimiter") ?? "_",
    includeAdverb: truthy(searchParams.get("adverb")),
    includePredicate: truthy(searchParams.get("predicate")),
    includeSpecialChar: truthy(searchParams.get("specialCharacter")),
    includeNumber: truthy(searchParams.get("num")),
    numberOfDigits: parseDigits(searchParams.get("digits")),
    caseStyle: searchParams.get("case") ?? undefined,
    securityGrade: truthy(searchParams.get("securityGrade")),
    cryptoSecure: truthy(searchParams.get("cryptoSecure")),
    seed: searchParams.get("seed") ?? undefined,
    specialChars: parseSpecialChars(searchParams.get("specialChars")),
  })

  return corsJson({
    phrase: truthy(searchParams.get("capFirst")) ? capFirstOnly(phrase) : phrase,
  })
}
