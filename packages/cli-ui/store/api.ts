import {ProjectAppData, ProjectPaths, ServerInfos} from "@kraken/types";
import {useStateStore} from "~/store/state";

export const useApiStore = defineStore('api', {
  actions: {
    async fetchAppData(path?: string): Promise<ProjectAppData | undefined> {
      if (path == null) {
        const $state = useStateStore()
        path = $state.paths?.project_path
      }
      return useApiFetch('/api/appdata', {params: {cwd: path}})
    },

    async fetchInfos(): Promise<ServerInfos> {
      return useApiFetch('/api/infos')
    },

    async fetchFolders(path: string, config?: { only_current: boolean }): Promise<any[]> {
      config = Object.assign({}, {only_current: false}, config)
      return useApiFetch('/api/fs/files', {query: {path, ...config}})
    },

    async fetchJavaFiles(path: string): Promise<string[]> {
      return useApiFetch('/api/fs/files/java', {query: {path}})
    },

    async fetchJavaRootDir(cwd: string): Promise<string> {
      const {path} = await useApiFetch<{ path: string }>('/api/fs/rootdir', {query: {path: cwd}})
      return path
    },

    async fetchProjectPaths(path: string): Promise<ProjectPaths> {
      return useApiFetch('/api/paths', {query: {path}})
    },

    async fetchPathInfo(cwd: string, root?: string): Promise<any> {
      return useApiFetch('/api/fs/path/info', {query: {path: cwd, root}})
    },

    async handleCreateNewDirectory(path: string, name: string) {
      return useApiFetch('/api/fs/dir', {method: 'post', body: {path, name}})
    },

    async handleGenerateController(data: any) {
      return useApiFetch('/api/generate/controller', {method: 'post', body: data})
    },

    async handleGenerateReferentiel(data: any) {
      return useApiFetch('/api/generate/ref', {method: 'post', body: data})
    },

    async handleOpenCurrentProjectDirectory(path: string) {
      return useApiFetch('/api/shell/open_current_project', {query: {path}})
    },

    async handleOpenCurrentProjectInIntellij(path: string) {
      return useApiFetch('/api/shell/open_in_idea', {query: {path}})
    },

    async handleRefreshAppData(path?: string): Promise<any> {
      if (path == null) {
        const $state = useStateStore()
        path = $state.paths?.project_path
      }
      return useApiFetch('/api/appdata', {method: 'post', body: {cwd: path}})
    },

    async handleSelectDirectory(): Promise<string> {
      return useApiFetch('/api/fs/folder')
    },

    async fetchUtilsPathNormalize(path: string): Promise<string> {
      return useApiFetch('/api/utils/path/normalize', {query: {path}})
    }
  }
})
