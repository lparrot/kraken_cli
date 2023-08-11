export function isBlank(value: string | undefined) {
  return value == null || value.trim().length == 0
}

export function isNotBlank(value: string | undefined) {
  return !isBlank(value)
}

export function convertLineBreakToBR(value: string) {
  return value.replace(/\r\n|\r|\n/g, '<br />')
}
