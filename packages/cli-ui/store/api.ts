import {ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos} from "@kraken/types";
import {useStateStore} from "~/store/state";
import omit from "lodash/omit";

export const useApiStore = defineStore('api', {
  actions: {
    async fetchAppData(path?: string): Promise<ProjectAppData | undefined> {
      if (path == null) {
        const $state = useStateStore()
        path = $state.paths?.project_path
      }
      return useApiFetch('/api/appdata', {params: {cwd: path}})
    },

    async fetchInfos() {
      return useApiFetch<ServerInfos>('/api/infos')
    },

    async fetchFolders(path: string, config?: { only_current: boolean }) {
      config = Object.assign({}, {only_current: false}, config)
      return useApiFetch<any[]>('/api/fs/files', {query: {path, ...config}})
    },

    async fetchJavaFiles(path: string) {
      return useApiFetch<string[]>('/api/fs/files/java', {query: {path}})
    },

    async fetchJavaRootDir(cwd: string) {
      const {path} = await useApiFetch<{ path: string }>('/api/fs/rootdir', {query: {path: cwd}})
      return path
    },

    async fetchProjectPaths(cwd: string) {
      return useApiFetch<ProjectPaths>('/api/paths', {query: {cwd}})
    },

    async fetchProject(id: number) {
      return useApiFetch<ProjectAttributes>(`/api/projects/${id}`)
    },

    async fetchProjects() {
      return useApiFetch<ProjectAttributes[]>('/api/projects')
    },

    async fetchUtilsPathNormalize(path: string) {
      return useApiFetch<string>('/api/utils/path/normalize', {query: {path}})
    },

    async fetchPathInfo(cwd: string, root?: string) {
      return useApiFetch<any>('/api/fs/path/info', {query: {path: cwd, root}})
    },

    async fetchThreads() {
      return useApiFetch<any>('/api/')
    },

    async handleCreateNewDirectory(path: string, name: string) {
      return useApiFetch('/api/fs/dir', {method: 'post', body: {path, name}})
    },

    async handleGenerateController(data: any) {
      return useApiFetch('/api/generate/controller', {method: 'post', body: data})
    },

    async handleGenerateReferentiel(data: any) {
      return useApiFetch('/api/generate/ref', {method: 'post', body: omit(data, ['entity', 'dao'])})
    },

    async handleOpenCurrentProjectDirectory(path: string) {
      return useApiFetch('/api/shell/open_current_project', {query: {path}})
    },

    async handleOpenCurrentProjectInIntellij(path: string) {
      return useApiFetch('/api/shell/open_in_idea', {query: {path}})
    },

    async handleRefreshAppData(path?: string) {
      if (path == null) {
        const $state = useStateStore()
        path = $state.paths?.project_path
      }
      return useApiFetch<any>('/api/appdata', {method: 'post', body: {cwd: path}})
    },

    async handleRunJavaApplication(cwd: string) {
      return useApiFetch<any>('/api/shell/run/java', {query: {cwd}})
    },

    async handleSelectDirectory() {
      return useApiFetch<string>('/api/fs/folder')
    }
  }
})
