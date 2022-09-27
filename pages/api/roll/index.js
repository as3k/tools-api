const { allowCors } = require("../util/")
import { DiceRoller } from "@dice-roller/rpg-dice-roller"

const handler = (req, res) => {
  let rollString 
  req.query.ndn 
    ? rollString = req.query.ndn
    : rollString = '1d20'
  
  const roller = new DiceRoller()

  const roll = roller.roll(rollString)
  res.send(roll)
}

module.exports = allowCors(handler)