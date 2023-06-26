import path from 'path'
import {get_project_paths} from './folders.js'
import {globSync} from 'glob'
import {logger} from './logger.js'

export function convertJavaFilenameToClassFullName(file: string, cwd?: string) {
  if (cwd == null) {
    const paths = get_project_paths(cwd)

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return;
    }

    cwd = paths.server_java_path
  }
	return path.normalize(file).replace(path.normalize(cwd) + path.sep, '').replaceAll(path.sep, '.').replace('.java', '')
}

export function convertJavaFilenameToClassSimpleName(file: string) {
  return path.basename(file).replaceAll('.java', '')
}

export function get_file_by_basename(basename: string, cwd: string) {
  if (cwd == null) {
    const paths = get_project_paths()

    if (paths == null) {
      logger('error', `Vous n'êtes pas dans un projet kraken`)
      return null;
    }

    cwd = paths.project_path
  }

	if (basename != null && basename.trim() !== '') {
		const result = globSync(basename, { cwd, absolute: true, matchBase: true, nocase: true })
		if (result.length) {
			return path.normalize(result[0])
		}
	}
	return null
}
