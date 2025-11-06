import { corsJson, corsPreflight } from "../../_lib/cors"
import constructPhrase from "../../_lib/construct-phrase"
import wordArr from "../../_lib/word-array"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const GET = request => {
  const { searchParams } = request.nextUrl

  const terms = wordArr({
    capFirst: searchParams.get("capFirst"),
    adverb: searchParams.get("adverb"),
    predicate: searchParams.get("predicate"),
  })

  const phrase = constructPhrase(terms, {
    del: searchParams.get("del"),
    specialCharacter: searchParams.get("specialCharacter"),
    number: searchParams.get("num"),
  })

  return corsJson({ phrase })
}
