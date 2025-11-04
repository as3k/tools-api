// API route that rolls RPG-style dice expressions using @dice-roller/rpg-dice-roller and
// returns the roll result JSON, with CORS enabled for public GET requests.

// Example: GET /api/roll?ndn=2d6+3 → { "notation": "2d6+3", "total": 11, ... }
const { allowCors } = require("../util")
const { DiceRoller } = require("@dice-roller/rpg-dice-roller")

const handler = (req, res) => {
  let rollString
  req.query.ndn
    ? rollString = req.query.ndn
    : rollString = '1d20'

  const roller = new DiceRoller()

  const roll = roller.roll(rollString)
  res.send(roll)
}

const wrappedHandler = allowCors(handler)

module.exports = wrappedHandler
module.exports.default = wrappedHandler
