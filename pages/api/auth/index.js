// API route stub for auth namespace; currently returns a simple health message with CORS.
// Example: GET /api/auth → { "message": "testing" }
const { allowCors } = require("../util")

const handler = (req, res) => {
  res.send({message: 'testing'})
}

const wrappedHandler = allowCors(handler)

module.exports = wrappedHandler
module.exports.default = wrappedHandler
