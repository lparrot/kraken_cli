import { useStateStore } from '~/store/state'

export function convertPathToPackage(path: string) {
  const $state = useStateStore()
  const pathToReplace = $state.paths?.server_java_path! + (path.endsWith($state.infos?.separator!) ? $state.infos?.separator : '')
  let pkg = path.replaceAll(pathToReplace, '')
    .split($state.infos?.separator!)
    .filter(it => isNotBlank(it))
    .join('.')

  if (isBlank(pkg)) {
    pkg = '<package principal>'
  }
  return pkg
}
