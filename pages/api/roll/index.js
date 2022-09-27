const { allowCors } = require("../util/")
import { DiceRoller } from "@dice-roller/rpg-dice-roller"

const handler = (req, res) => {
  const rollString = req.query.ndn
  const roller = new DiceRoller()
  const str = decodeURI('3d6+4')
  console.log(str)

  const roll = roller.roll(rollString)
  res.send(roll)
}

module.exports = allowCors(handler)