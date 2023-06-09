export function isBlank(str: string) {
  return str == null || str.trim() === ''
}

export function isNotBlank(str: string) {
  return !isBlank(str)
}

export function removeAllAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
