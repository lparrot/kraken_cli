export interface TemplateGeneratorOptions {
  templatePath: string
  targetPath: string
  cwd?: string
  errorIfFolderAlreadyExists?: boolean
  data: any
}

export interface ProjectPath {
  project_path: string;
  server_root_path: string;
  server_java_path: string;
  server_resources_path: string;
  web_root_path: string;
  web_pages_path: string;
  server_current_package?: string | undefined;
  get_current_package?: (dirname: string) => string | undefined;
}

export interface TemplateInitOptions {
  cwd?: string
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
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPRESS_DEV_CWD: string;
    }
  }
}
