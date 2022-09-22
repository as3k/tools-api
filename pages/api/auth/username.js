const { adjectives, laureates, allowCors, randomItem } = require('../util');

randomItem

const handler = (req, res) => {
  const nameString = `${randomItem(adjectives)}-${randomItem(laureates)}`
  
  res.send({
    username: nameString.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
  })

};

module.exports = allowCors(handler)