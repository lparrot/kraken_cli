import {useStateStore} from "~/store/state";

export function convertPathToPackage(path: string) {
  const $state = useStateStore()
  return path.replaceAll($state.paths?.server_java_path! + $state.infos?.separator, '').replaceAll($state.infos?.separator!, '.')
}
