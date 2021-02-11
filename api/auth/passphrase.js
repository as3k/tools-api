const gen = require('ultra-ignorant-aardvark');
const allowCors = require('../../util/allowCors.js');

/**
 * @description Takes the Ultra-ignorant-aardvark string and splits it into an array.
 */
function wordArr (num) {
  const n = Math.floor(Math.random() * 6) + 1
  const arr = gen({
    includePredicate: true,
    capitalizeAllWords: true,
    delimiter: '_'
  }).split('_')

  if (num) {
    if (n > 1) {
      arr[2] = `${arr[2]}s`
    }
    arr.unshift(n)
    
  }
  return arr
}


/**
 * @param {Array} arr The array to use for generating the phrase.
 * @param {Object} config - The configuration Object.
 * @description Configuration object takes {del: String, caps: Boolean}.
 * @returns String
 */
function constructPhrase(arr, config) {

  let capitalize = config.cap ? config.cap : false
  let delimiter = config.del? config.del : '_'

  let phrase = arr.join(delimiter)
  if (!capitalize) { phrase = phrase.toLowerCase() }

  return phrase
}


const handler = (req, res) => {
  
  let genString = wordArr(req.query.num)

  let phrase = constructPhrase(genString, {
    del: req.query.del, 
    caps: req.query.caps
  })

  res.json({ phrase })
}

module.exports = allowCors(handler)