const adjectives = require('./lib/adjectives.json')
const laureates = require('./lib/laureates.json')
const { randomItem, randomNumber, randomNumberString } = require('./random')
const allowCors = require('./allowCors')
const genDelimitedString = require('./genDelimitedString')
const constructPhrase = require('./construct-phrase')
const wordArr = require('./word-array')

module.exports = {
  adjectives,
  allowCors,
  genDelimitedString,
  randomItem,
  randomNumber,
  randomNumberString,
  laureates,
  constructPhrase,
  wordArr,
}