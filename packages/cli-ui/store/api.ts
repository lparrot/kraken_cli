import {ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos} from "@kraken/types";
import {useStateStore} from "~/store/state";
import omit from "lodash/omit";
import {promiseTimeout} from "@vueuse/core";

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

    async handleRunJavaApplication(cwd: string, timeout = 60) {
      return new Promise(async (resolve, reject) => {
        const $state = useStateStore()
        await $state.fetchPing()

        await useApiFetch<any>('/api/shell/run/java', {query: {cwd}})
        let count = 0;
        while (count < timeout && !$state.projectPing) {
          await $state.fetchPing()
          if (!$state.projectPing) {
            await promiseTimeout(2000)
          }
          count++;
        }
        if (count >= timeout) {
          return resolve(false)
        }
        return resolve(true)
      })
    },

    async handleSelectDirectory() {
      return useApiFetch<string>('/api/fs/folder')
    },

    async handleProjectApiPing(id?: number) {
      if (id == null) {
        id = useStateStore().project?.id
      }

      const res = await useApiFetch<{ success: boolean }>(`/api/projects/${id}/ping`)

      return res.success
    },

    async handleProjectApiLogs(id?: number) {
      if (id == null) {
        id = useStateStore().project?.id
      }

      return useApiFetch<string[]>(`/api/projects/${id}/logs`)
    },

    async handleProjectApiStopJavaApplication(id?: number) {
      if (id == null) {
        id = useStateStore().project?.id
      }

      const res = await useApiFetch<{ success: boolean }>(`/api/projects/${id}/exit`)

      return res.success
    },

    async handleProjectApiRestartJavaApplication(id?: number) {
      const $state = useStateStore();

      if (id == null) {
        id = $state.project?.id
      }

      await this.handleProjectApiStopJavaApplication(id)
      await this.handleRunJavaApplication($state.project?.path!)
    }
  }
})
