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

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPRESS_DEV_CWD: string;
    }
  }
}
