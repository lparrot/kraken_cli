export function isBlank(str: string | null) {
  return str == null || str.trim() === ''
}

export function isNotBlank(str: string | null) {
  return !isBlank(str)
}

export function removeAllAccents(data: any) {
  if (typeof data === 'string') {
    return data.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
  return data
}
