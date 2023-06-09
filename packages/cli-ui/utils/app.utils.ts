import {get_project_paths} from "@kraken/cli/src/utils/folders";

export function getProjectPaths() {
  return get_project_paths(process.env.NODE_ENV === 'development' ? process.env.NUXT_DEV_PROJECT_PATH : process.cwd())
}
