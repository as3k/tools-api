export const randomItem = array => array[Math.floor(Math.random() * array.length)]

export const randomNumber = () => {
  const n = Math.floor(Math.random() * 9 + 1)
  return n
}

export const randomNumberString = (length = 3) => {
  const ns = []
  for (let i = 0; i < length; i += 1) {
    ns.push(randomNumber())
  }
  return ns.join("")
}
