import {useAppStore} from "~/store/app";

export function convertPathToPackage(path: string) {
  const appStore = useAppStore()

  return path.replaceAll(appStore.paths?.server_java_path! + '\\', '').replaceAll("\\", '.')
}
