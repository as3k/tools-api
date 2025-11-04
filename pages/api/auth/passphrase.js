// API route that builds customizable passphrases from word lists and options like
// capitalization, delimiters, special characters, and numbers.
// Example: GET /api/auth/passphrase?capFirst=true&num=42 → { "phrase": "Brisk-Meteor-42" }
const { allowCors, constructPhrase, wordArr } = require('../util');

const handler = (req, res) => {  
  let genString = wordArr({
    capFirst: req.query.capFirst, 
    adverb: req.query.adverb, 
    predicate: req.query.predicate,
  })

  let phrase = constructPhrase(genString, {
    del: req.query.del,
    specialCharacter: req.query.specialCharacter,
    number: req.query.num,
  })

  if (req.query.num) {

  }

  res.json({ phrase })
}

const wrappedHandler = allowCors(handler)

module.exports = wrappedHandler
module.exports.default = wrappedHandler
