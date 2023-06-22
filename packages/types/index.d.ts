export interface ProjectServerInfos {
  project_path: string
  server_root_path: string
  server_java_path: string
  server_resources_path: string
  web_root_path: string
  web_pages_path: string
  server_current_package?: string | undefined
  get_current_package?: (dirname: string) => string | undefined
  separator: string
}

export interface ProjectAttributes {
  id: number
  name: string
  path: string
}

export interface ResponseFsPackages {
  folder: string
  fullpath: string
}
