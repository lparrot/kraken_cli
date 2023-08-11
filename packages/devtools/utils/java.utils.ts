export function convertPathToPackage(path: string) {
  if (path == null) {
    return null
  }

  const $state = useStateStore()
  const pathToReplace = $state.paths?.server_java_path! + (path.endsWith($state.os_infos?.separator!) ? $state.os_infos?.separator : '')
  let pkg = path.replaceAll(pathToReplace, '')
    .split($state.os_infos?.separator!)
    .filter(it => isNotBlank(it))
    .join('.')

  if (isBlank(pkg)) {
    pkg = '<package principal>'
  }
  return pkg
}
