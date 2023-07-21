import trimStart from "lodash/trimStart.js";
import trimEnd from "lodash/trimEnd.js";

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

export function stringToBoolean(str: any) {
  if (str == null || typeof str !== 'string') {
    return false
  }
  return str.toLowerCase() === 'true'
}

export function trimBothSide(value: string, character: string = ' ') {
  value = trimStart(value, character)
  value = trimEnd(value, character)
  return value
}
