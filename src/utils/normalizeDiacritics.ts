function normalizeDiacritics(value: string): string {
  if (!value) return ''

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default normalizeDiacritics
