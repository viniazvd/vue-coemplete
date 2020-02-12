import contains from './contains'

function getDiacritic (obj, key, word, words) {
  const remaining = contains(word, words)
  const chunk = obj[key].slice(0, -remaining)

  return remaining ? chunk : obj[key]
}

export default getDiacritic
