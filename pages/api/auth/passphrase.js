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

module.exports = allowCors(handler)