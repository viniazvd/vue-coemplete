import getRemaining from './getRemaining'

function getDiacritic (obj: object, key: string, word: string, words: string): string {
  const { atBeginning, remaining } = getRemaining(word, words)
  const untilEnd = remaining + word.length

  if (word === words) return obj[key]

  return atBeginning
    ? obj[key].slice(0, remaining)
    : obj[key].slice(remaining, untilEnd)
}

export default getDiacritic
