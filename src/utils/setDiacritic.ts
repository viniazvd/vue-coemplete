import normalizeDiacritics from './normalizeDiacritics'

function setDiacritic (items: object[], normalizeProp: string, searchProp: string): object[] {
  return items.map((item: object) => ({
    ...item,
    [normalizeProp]: normalizeDiacritics(item[searchProp])
  }))
}

export default setDiacritic