import getMatches from './getMatches'

function getRemaining (word: string, words: string): object {
  const matches: string[] = getMatches(word, words)
  const atBeginning: boolean = !matches[0].length
  const remaining: number = (matches.filter(Boolean)[0] || []).length

  return {
    atBeginning,
    remaining: atBeginning ? remaining * -1 : remaining
  }
}

export default getRemaining

