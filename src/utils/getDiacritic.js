import getRemaining from './getRemaining'

function getDiacritic (obj, key, word, words) {
  const { atBeginning, remaining } = getRemaining(word, words)
  const endSlice = remaining + word.length

  if (word === words) return obj[key]

  return atBeginning
    ? obj[key].slice(0, remaining)
    : obj[key].slice(remaining, endSlice)
}

export default getDiacritic
