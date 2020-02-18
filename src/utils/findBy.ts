const normalizeString = (value: string): string => {
  if (!value) return ''

  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getWords (query: string): string {
  if (!query) return ''

  return query.trim().split(' ')
}

function findBy (xs = [], query: string = '', key: string = '') {
  const words: string = getWords(query)

  return xs.filter(option => normalizeString(option[key]).includes(query))
}

export default findBy
