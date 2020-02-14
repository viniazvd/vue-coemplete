import normalizeDiacritics from './normalizeDiacritics'

function getMatches (word = '', words = '') {
  const normalizedWord = normalizeDiacritics(word)
  const normalizedWords = normalizeDiacritics(words)

  return normalizedWords.toLowerCase().split(normalizedWord.toLowerCase())
}

export default getMatches
