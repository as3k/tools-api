const adjectives = require('../../util/lib/adjectives.json');
const names = require('../../util/lib/laureates.json');

const allowCors = require('../../util/allowCors.js');
const getRandomItem = require('../../util/getRandomItem.js');
const genString = require('../../util/genDelimitedString.js');

const handler = (req, res) => {
  const nameString = `${getRandomItem(adjectives)}-${getRandomItem(names)}`
  
  res.send({
    username: nameString.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
  })

};

module.exports = allowCors(handler)