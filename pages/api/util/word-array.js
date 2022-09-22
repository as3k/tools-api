const gen = require('ultra-ignorant-aardvark')

/**
 * @description Takes the Ultra-ignorant-aardvark string and splits it into an array.
 */
const wordArr = (config) => {
  let capFirst = config.capFirst ? config.capFirst: false
  let predicate = config.predicate ? config.predicate: false
  let adverb = config.adverb ? config.adverb: false

  const arr = gen({
    includeRandomAdverbs: adverb,
    capitalizeFirstWord: capFirst,
    includePredicate: predicate,
    capitalizeAllWords: false,
    delimiter: '_'
  }).split('_')

  return arr

}

module.exports = wordArr