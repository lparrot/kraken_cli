import { useStateStore } from '~/stores/state.store'
import { promiseTimeout } from '@vueuse/core'
import { OsPathInfo, PostFsDirBody, PostGenerateControllerBody, PostGeneratePageBody, PostGenerateReferentielBody, ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos } from '@kraken/types'

export const useApiStore = defineStore('api', () => {
  const $state = useStateStore()

  return {
    async fetchAppData(cwd?: string) {
      if (cwd == null) {
        const $state = useStateStore()
        cwd = $state.paths?.project_path
      }
      return useApiFetch<ProjectAppData | undefined>('/api/projects/appdata', { params: { cwd } })
    },

    async fetchAppProfiles(id?: number): Promise<string[]> {
      if (id == null) {
        id = $state.project?.id
      }

      if (id == null) {
        return []
      }

      return useApiFetch<string[]>(`/api/projects/${id}/env_profiles`)
    },

    async fetchFsFilesJava(cwd: string) {
      return useApiFetch<string[]>('/api/fs/files/java', { query: { cwd } })
    },

    async fetchOsInfos() {
      return useApiFetch<ServerInfos>('/api/os/infos')
    },

    async fetchOsPathInfo(cwd: string = '/', root: string = '') {
      return useApiFetch<OsPathInfo>('/api/os/path/info', {
        query: { path: cwd, root }
      })
    },

    async fetchProject(id: number) {
      return useApiFetch<ProjectAttributes>(`/api/projects/${id}`)
    },

    async fetchProjectJavaRootDir(id?: number) {
      if (id == null) {
        id = $state.project!!.id
      }

      if (id == null) {
        return
      }

      return await useApiFetch<string>(`/api/projects/${id}/rootdir`)
    },

    async fetchProjectPaths(cwd?: string) {
      if (cwd == null) {
        cwd = $state.project?.path
      }
      return useApiFetch<ProjectPaths>('/api/projects/paths', { query: { cwd } })
    },

    async fetchProjects() {
      return useApiFetch<ProjectAttributes[]>(`/api/projects`)
    },

    async handleFsCreateDir(data: Partial<PostFsDirBody>) {
      return useApiFetch<void>('/api/fs/dir', { method: 'post', body: data })
    },

    async handleGenerateController(data: Partial<PostGenerateControllerBody>) {
      return useApiFetch<void>('/api/generate/controller', { method: 'post', body: data })
    },

    async handleGenerateInit(data: any) {
      return useApiFetch<ProjectAttributes>('/api/generate/init', {
        method: 'post',
        body: {
          ...data,
          with_create: true
        }
      })
    },

    async handleGeneratePage(data: Partial<PostGeneratePageBody>) {
      return useApiFetch<void>(`/api/generate/page`, { method: 'post', body: data })
    },

    async handleGenerateReferentiel(data: Partial<PostGenerateReferentielBody>) {
      return useApiFetch<void>('/api/generate/referentiel', { method: 'post', body: data })
    },

    async handleProjectAppdataCreate(cwd?: string) {
      if (cwd == null) {
        const $state = useStateStore()
        cwd = $state.paths?.project_path
      }
      return useApiFetch<ProjectAppData>('/api/projects/appdata', { method: 'post', body: { cwd } })
    },

    async handleProjectCompile(id?: number) {
      if (id == null) {
        id = $state.project!!.id
      }

      if (id == null) {
        return
      }

      await useApiFetch(`/api/projects/${$state.project?.id}/compile`)
    },

    async handleProjectCreate(data: any) {
      return await useApiFetch<ProjectAttributes>('/api/projects', {
        method: 'post',
        body: data
      })
    },

    async handleProjectOpenInExplorer(cwd: string) {
      return useApiFetch<void>('/api/projects/open_in_exporer', { query: { cwd } })
    },

    async handleProjectOpenInIntellijIdea(cwd: string) {
      return useApiFetch<void>('/api/projects/open_in_idea', { query: { cwd } })
    },

    async handleProjectPing(id?: number) {
      const $state = useStateStore()
      if (id == null) {
        id = $state.project?.id
      }

      if (id == null) {
        return false
      }

      $state.ping = await useApiFetch<boolean>(`/api/projects/${id}/ping`)

      return $state.ping
    },

    async handleProjectRemove(id: number) {
      return useApiFetch<void>(`/api/projects/${id}`, { method: 'delete' })
    },

    async handleProjetRun(cwd: string, options?: Partial<{ profile: string, timeout: number }>) {
      options = Object.assign({}, { profile: 'default', timeout: 60 }, options)

      return new Promise(async (resolve, reject) => {
        const $state = useStateStore()
        await $state.fetchPing()

        await useApiFetch<any>('/api/projects/run', { query: { cwd, profile: options?.profile } })
        let count = 0
        while (count < options?.timeout! && !$state.ping) {
          await $state.fetchPing()
          if (!$state.ping) {
            await promiseTimeout(2000)
          }
          count++
        }
        if (count >= options?.timeout!) {
          return resolve(false)
        }
        return resolve(true)
      })
    },

    async handleProjectExit(id?: number) {
      if (id == null) {
        id = $state.project?.id
      }

      if (id == null) {
        return
      }

      const success = await useApiFetch<boolean>(`/api/projects/${id}/exit`)

      if (success) {
        $state.ping = false
      }

      return success
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useApiStore, import.meta.hot))
}
