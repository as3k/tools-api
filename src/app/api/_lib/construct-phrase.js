import { randomItem, randomNumberString } from "./random"

const constructPhrase = (arr, config) => {
  const delimiter = config.del ?? "_"
  const specialChar = config.specialCharacter ? randomItem(["?", "!", "$", "*", "@", "."]) : ""
  const num = config.number ? randomNumberString() : ""
  return arr.join(delimiter) + specialChar + num
}

export default constructPhrase
