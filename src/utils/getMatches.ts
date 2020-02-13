import normalizeDiacritics from './normalizeDiacritics'

function getMatches (word = '', words = '') {
  const normalizedWord = normalizeDiacritics(word)
  const normalizedWords = normalizeDiacritics(words)
  console.log({ normalizedWord, normalizedWords })

  return normalizedWords.toLowerCase().split(normalizedWord.toLowerCase())
}

export default getMatches
