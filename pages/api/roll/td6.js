const { allowCors } = require("../util")

const roll = (numDice) => {
  let arr = []
  let success = false
  for (let i=0; i<numDice; i++) {
    arr.push( Math.floor(Math.random() * Math.floor(6) + 1))
  }
  if (arr.includes(6) || arr.includes(5)) {
    success = true
  }
  return { rolls: arr, success }
}

const handler = (req, res) => {

  const count = req.query.count ? req.query.count : 2
  res.send({...roll(count)})
}

module.exports = allowCors(handler)