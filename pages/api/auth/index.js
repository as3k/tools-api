const { allowCors } = require("../util")

const handler = (req, res) => {
  res.send({message: 'testing'})
}

module.exports = allowCors(handler)