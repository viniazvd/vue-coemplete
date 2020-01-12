function getWords (query: string): string[] {
  return query.trim().split(' ')
}

function getMatches (word: string, words: string): number {
  return word
    ? words.toLowerCase().split(word.toLowerCase()).length - 1
    : 0
}

function findByInclusive (xs: string[] = [], query: string = '', key: string = ''): any[] {
  const words: string[] = getWords(query)

  return xs.filter(option => words.every(word => getMatches(word, (option[key] || ''))))
}

export default findByInclusive
