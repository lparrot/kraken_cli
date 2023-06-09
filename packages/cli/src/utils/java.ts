import fs from 'fs'

export const REGEX = {
  className: '[A-Z][A-Za-z0-9\<\>\._? ]+',
  property: '[a-z][A-Za-z0-9\._]+',
  method: '[a-z][A-Za-z0-9_]+',
  scope: 'private|public|protected'
}

export function readJavaFile(file: string) {
  return fs.readFileSync(file, {encoding: 'utf-8'})
}

export function readAllProperty(content: string) {
  const regex = content.matchAll(new RegExp(`(?<scope>${REGEX.scope})? (?<type>${REGEX.className}) (?<name>${REGEX.property})[ ]*[;|=]`, 'g'));
  return Array.from(regex, m => Object.assign({}, m.groups))
}

export function readAllMethods(content: string) {
  const regex = content.matchAll(new RegExp(`(?<scope>${REGEX.scope})? (?<return_type>${REGEX.className}) (?<name>${REGEX.method})[ ]*[(]{1}[.]*[)]{1}`, 'g'));
  return Array.from(regex, m => Object.assign({}, m.groups))
}
