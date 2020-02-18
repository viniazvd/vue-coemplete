import normalizeDiacritics from './normalizeDiacritics'

function setDiacritic (xs: object[], normalizeProp: string, searchProp: string): object[] {
  return xs.map((item: object) => ({
    ...item,
    [normalizeProp]: normalizeDiacritics(item[searchProp])
  }))
}

export default setDiacritic