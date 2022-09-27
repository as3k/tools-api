const { allowCors, randomItem } = require("./util")

let replies = [
  'Definitely! 8-0 shot!', 'You lookin\' badass!', 'Signs pointin\' to DAMN STRAIGHT!', 'HELL YEA!', 'Shit yea fam!',
  'SHIT NO.... ok ok yea.', 'ESKETIT!!!', 'OK Homie! Let\'s do it!', 'Shit dogg, I\'m busy... but yea.', 'LETS GOOOOOOOO!',
  'My homie\'s sayin nah.', 'Real damn doubtful...', 'Yo ass be butta!', 'Get yo little ass outta here with that shit!', 'Fuck no! Fo real!? smh',
  'I say goddamm!', 'I\'m hungover... Hit me up later.', 'I aint tellin yo ass now, BITCH!', 'Gotta throw salt in yo game, bro', 'Hold on, gotta hit this bong', 'BRUH!!' 
]

const handler = (req, res) => {
  const reply = randomItem(replies)
  res.send({ message: reply })
}

module.exports = allowCors(handler)