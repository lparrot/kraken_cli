export type LoggerLevel = 'success' | 'info' | 'warn' | 'error'

export interface TemplateGeneratorOptions {
  templatePath: string
  targetPath: string
  cwd?: string
  errorIfFolderAlreadyExists?: boolean
  data: any
  add_to_git?: boolean
}

export interface TemplateInitOptions {
  cwd: string
  name: string
  description: string
  group_id: string
  artifact_id: string
  socle_version: string
  node_version: string
  db_host: string
  db_port: string
  db_name: string
  db_user: string
  db_password: string
  install_librairies: boolean
  create_git_repo: boolean
  with_create: boolean
}

export interface PostGenerateControllerBody {
  cwd: string
  name: string
  url: string
}

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
  application_host: string;
  api_host: string;
  port: number;
  application_pid: string;
  application_log_file: string;
  security_key: string;
  application_main_class: string;
  socle_version: string;
  environments?: string[];
  entities: ProjectAppDataEntity[]
}

export interface ProjectAppDataEntity {
  name: string
  type: string
  type_simple: string
  file_path: string
  dao?: ProjectAppDataDao
  attributes?: ProjectAppDataAttribute[];
}

export interface OsPathInfo {
    label: string;
    path: string;
    parent: string;
    breadcrumb?: (BreadcrumbEntityOrChildrenEntity)[] | null;
    children?: (BreadcrumbEntityOrChildrenEntity)[] | null;
}

export interface OsPathInfoBreadcrumbEntityOrChildrenEntity {
    path: string;
    label: string;
}

export interface ProjectRunApplicationOptions {
  profile?: string
  timeout?: number
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
  level?: LoggerLevel
  data?: any
}

export interface ServerToClientEvents {
  'server:action': (message: string) => void
  'server:status': (message: string) => void
}

export interface ClientToServerEvents {

}

export interface ServerToClientDevtoolsEvents {
  'log:message': (message: SocketMessage) => void
}

export interface ClientToServerDevtoolsEvents {

}

export {}
