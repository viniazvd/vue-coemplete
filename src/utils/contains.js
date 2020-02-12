const contains = (word = '', words = '') => {
  const matches = words
    .toLowerCase()
    .split(word.toLowerCase())
    .filter(Boolean)

  return (matches[0] || []).length
}

export default contains
