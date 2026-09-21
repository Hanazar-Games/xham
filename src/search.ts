export const normalizeSearch = (value: string) =>
  value.normalize('NFKC').toLowerCase().replace(/[\s:·\p{Dash_Punctuation}]/gu, '')

export const searchTerms = (query: string) =>
  query.normalize('NFKC').trim().split(/\s+/).map(normalizeSearch).filter(Boolean)
