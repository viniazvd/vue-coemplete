import getMatches from './getMatches'

function getRemaining (word, words) {
  const matches = getMatches(word, words)
  const atBeginning = !matches[0].length
  const remaining = (matches.filter(Boolean)[0] || []).length

  return {
    atBeginning,
    remaining: atBeginning ? remaining * -1 : remaining
  }
}

export default getRemaining
