const { adjectives, getRandomItem, laureates, allowCors } = require('../util');

const handler = (req, res) => {
  const nameString = `${getRandomItem(adjectives)}-${getRandomItem(laureates)}`
  
  res.send({
    username: nameString.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
  })

};

module.exports = allowCors(handler)