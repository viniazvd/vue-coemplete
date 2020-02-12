const normalizeDiacritics = value => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default normalizeDiacritics
