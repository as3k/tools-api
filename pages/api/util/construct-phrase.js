const { randomNumberString, randomItem } = require("./random")

/**
 * @param {Array} arr The array to use for generating the phrase.
 * @param {Object} config - The configuration Object.
 * @description Configuration object takes {del: String, caps: Boolean}.
 * @returns String
 */
 function constructPhrase(arr, config) {

  let delimiter = config.del? config.del : '_'
  let specialChar = config.specialCharacter ? randomItem(['?','!','$','*','@','.']) : ''
  let num = config.number ? randomNumberString() : ''

  let phrase = arr.join(delimiter) + specialChar + num

  return phrase
}

module.exports = constructPhrase