export interface ServerInfos {
  home_dir: string
  separator: string
  root_dir: string
  tmp_dir: string
  is_mvn_installed: boolean
  is_node_installed: boolean
  last_npm_version: string
  node_version: string
}

export interface ProjectPaths {
  project_path: string
  server_root_path: string
  server_java_path: string
  server_resources_path: string
  web_root_path: string
  web_pages_path: string
  server_current_package?: string | undefined
  get_current_package?: (dirname: string) => string | undefined
}

export interface ProjectAppData {
  entities: ProjectAppDataEntity[]
}

export interface ProjectAppDataEntity {
  attributes: ProjectAppDataAttribute[];
  dao?: ProjectAppDataDao
  filePath: string
  name: string
  type: string
}

export interface ProjectAppDataDao {
  filePath: string;
  name: string
  type: string
}

export interface ProjectAppDataAttribute {
  id?: boolean
  name: string,
  type: string
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
