import {globSync} from 'glob'
import path from 'path'

const BASE_SEARCH_PATH = 'web/nuxt.config.js'

const SERVER_ROOT_PATH = 'server'
const SERVER_JAVA_PATH = SERVER_ROOT_PATH + '/src/main/java'
const SERVER_RESOURCES_PATH = SERVER_ROOT_PATH + '/src/main/resources'

const WEB_ROOT_PATH = 'web'
const WEB_PAGES_PATH = WEB_ROOT_PATH + '/pages'

/**
 * @param {string?} [cwd]
 * @return ProjectPath
 */
export function get_project_paths(cwd) {
	let glob_result = []
	let project_path = cwd ? cwd : process.cwd()
	let root_path = path.parse(process.cwd()).root

	let complete = false

	while (!complete && project_path !== path.normalize(root_path)) {
		glob_result = globSync(`${BASE_SEARCH_PATH}`, {
			cwd: project_path,
			absolute: true,
			matchBase: true,
			strict: false
		})

		if (glob_result.length > 0) {
			complete = true
		} else {
			project_path = path.normalize(path.resolve(project_path, '..'))
		}
	}

	let paths = null

	if (project_path !== root_path) {
		paths = {
			project_path: path.normalize(project_path),
			server_root_path: path.normalize(path.resolve(project_path, SERVER_ROOT_PATH)),
			server_java_path: path.normalize(path.resolve(project_path, SERVER_JAVA_PATH)),
			server_resources_path: path.normalize(path.resolve(project_path, SERVER_RESOURCES_PATH)),
			web_root_path: path.normalize(path.resolve(project_path, WEB_ROOT_PATH)),
			web_pages_path: path.normalize(path.resolve(project_path, WEB_PAGES_PATH)),
		}

		function get_current_package(dirname) {
			if (paths != null && path.normalize(dirname).startsWith(paths.server_java_path)) {
				return path
					.normalize(dirname)
					.replace(path.normalize(paths.server_java_path), '')
					.split(path.sep)
					.filter((value) => value.trim() !== '')
					.join('.')
			}
		}

		paths.get_current_package = get_current_package
		paths.server_current_package = get_current_package(process.cwd())
	}

	return paths
}