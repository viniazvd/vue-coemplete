function getWords (query: string): string[] {
  return query.trim().split(' ')
}

function findBy (xs: object[] = [], query: string = '', key: string = ''): object[] {
  const words = getWords(query)

  return xs.filter(option => option[key].includes(query))
}

export default findBy
