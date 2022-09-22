/** 
 * Takes an array and spits out a random item from within that array.
 * @param {array} arr - The array you want to use.
 */

const randomItem = (array) => {
  let rand = Math.random() * array.length + 1;
  let val = Math.floor(rand);
  return array[val];
}
/**
 * @returns random number between 1 and 9
 */
const randomNumber = () => {
  let n = Math.random() * 9+1
  n = Math.floor(n)
  return n
}

/**
 * @returns string of random numbers. defaults to 3 digits.
*/
const randomNumberString = (length = 3) => {
  const ns = []
  const arr = [...Array(length)]
  arr.forEach(n => {
    ns.push(randomNumber())
  })
  return ns.join('')
}

module.exports = {
  randomItem,
  randomNumber,
  randomNumberString,
}