import {globSync} from 'glob'
import path from 'path'
import getCallerFile from 'get-caller-file'
import {ProjectPath} from "../../types/index.js";

const BASE_SEARCH_PATH = 'web/nuxt.config.js'

const SERVER_ROOT_PATH = 'server'
const SERVER_JAVA_PATH = SERVER_ROOT_PATH + '/src/main/java'
const SERVER_RESOURCES_PATH = SERVER_ROOT_PATH + '/src/main/resources'

const WEB_ROOT_PATH = 'web'
const WEB_PAGES_PATH = WEB_ROOT_PATH + '/pages'

export function get_project_paths(cwd?: string): ProjectPath | null {
  let glob_result = []
  let project_path = cwd ? cwd : process.cwd()
  let root_path = path.parse(cwd ? cwd : process.cwd()).root

  let complete = false

  while (!complete && project_path !== path.normalize(root_path)) {
    glob_result = globSync(`${BASE_SEARCH_PATH}`, {
      cwd: project_path,
      absolute: true,
      matchBase: true
    })

    if (glob_result.length > 0) {
      complete = true
    } else {
      project_path = path.normalize(path.resolve(project_path, '..'))
    }
  }

  let paths: ProjectPath | null = null

  if (project_path !== root_path) {
    paths = {
      project_path: path.normalize(project_path),
      server_root_path: path.normalize(path.resolve(project_path, SERVER_ROOT_PATH)),
      server_java_path: path.normalize(path.resolve(project_path, SERVER_JAVA_PATH)),
      server_resources_path: path.normalize(path.resolve(project_path, SERVER_RESOURCES_PATH)),
      web_root_path: path.normalize(path.resolve(project_path, WEB_ROOT_PATH)),
      web_pages_path: path.normalize(path.resolve(project_path, WEB_PAGES_PATH)),
    }

    function get_current_package(dirname: string) {
      if (paths != null && path.normalize(dirname).startsWith(paths?.server_java_path!)) {
        return path
          .normalize(dirname)
          .replace(path.normalize(paths.server_java_path), '')
          .split(path.sep)
          .filter((value) => value.trim() !== '')
          .join('.')
      }
    }

    paths.get_current_package = get_current_package
    paths.server_current_package = get_current_package(cwd ? cwd : process.cwd())
  }

  return paths
}

export async function getModules(glob: string, callback: (module: any) => void) {
  let callDirname = path.dirname(getCallerFile());
  const files = globSync(glob, {cwd: callDirname})

  for await (const file of files) {
    const module = await import(path.join(callDirname, file))
    callback(module)
  }
}
