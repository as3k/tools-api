import generator from "ultra-ignorant-aardvark"

const wordArray = config => {
  const capFirst = Boolean(config.capFirst)
  const predicate = Boolean(config.predicate)
  const adverb = Boolean(config.adverb)

  const phrase = generator({
    includeRandomAdverbs: adverb,
    capitalizeFirstWord: capFirst,
    includePredicate: predicate,
    capitalizeAllWords: false,
    delimiter: "_",
  })

  return phrase.split("_")
}

export default wordArray
