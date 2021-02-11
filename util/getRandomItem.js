/** 
 * Takes an array and spits out a random item from within that array.
 * @param {array} arr - The array you want to use.
 */

module.exports = (array) => {
    let rand = Math.random() * array.length + 1;
    let val = Math.floor(rand);
    return array[val];
};