const { allowCors } = require("./util")

const handler = (req, res) => {
  res.send({message: ''})
}

module.exports = allowCors(handler)