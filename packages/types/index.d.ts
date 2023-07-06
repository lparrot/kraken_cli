export type LoggerLevel = 'success' | 'info' | 'warn' | 'error'

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
  name: string
  type: string
  type_simple: string
  file_path: string
  dao?: ProjectAppDataDao
  attributes: ProjectAppDataAttribute[];
}

export interface ProjectAppDataDao {
  name: string
  type: string
  type_simple: string
  file_path: string;
}

export interface ProjectAppDataAttribute {
  id?: boolean
  collection?: boolean
  name: string,
  type: string
  type_simple: string
  bind_type: string
  bind_type_simple: string
  persistent_type?: string
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

export interface SocketMessage {
  level: LoggerLevel
  message: string
}

export interface ServerToClientEvents {
  'logger:message': (message: SocketMessage) => void
  'loader:show': (message: string) => void
  'loader:hide': () => void
}

export interface ClientToServerEvents {

}

export interface InterServerEvents {

}

export interface SocketData {

}

export {}
