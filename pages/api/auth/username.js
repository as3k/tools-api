// API route that returns a kebab-cased creative username assembled from random adjectives
// and Nobel laureate names, stripping diacritics for portability.

// Example: GET /api/auth/username → { "username": "radiant-pearson" }
const { adjectives, laureates, allowCors, randomItem } = require('../util');

const handler = (req, res) => {
  const nameString = `${randomItem(adjectives)}-${randomItem(laureates)}`

  res.send({
    username: nameString.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
  })
};

const wrappedHandler = allowCors(handler)

module.exports = wrappedHandler
module.exports.default = wrappedHandler
