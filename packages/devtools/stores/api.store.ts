import { useStateStore } from '~/stores/state.store'
import { promiseTimeout } from '@vueuse/core'

export const useApiStore = defineStore('api', () => {
  const $state = useStateStore()

  return {
    async fetchAppData(cwd?: string) {
      if (cwd == null) {
        const $state = useStateStore()
        cwd = $state.paths?.project_path
      }
      return useApiFetch('/api/projects/appdata', { params: { cwd } })
    },

    async fetchAppProfiles(id?: number) {
      if (id == null) {
        id = $state.project?.id
      }

      if (id == null) {
        return []
      }

      return useApiFetch<string[]>(`/api/projects/${id}/env_profiles`)
    },

    async fetchOsInfos() {
      return useApiFetch('/api/os/infos')
    },

    async fetchOsPathInfo(cwd: string = '/', root: string = '') {
      return useApiFetch('/api/os/path/info', {
        query: { path: cwd, root }
      })
    },

    async fetchProject(id: number) {
      return useApiFetch(`/api/projects/${id}`)
    },

    async fetchProjectPaths(cwd?: string) {
      if (cwd == null) {
        cwd = $state.project?.path
      }
      let { data: paths } = await useApiFetch<any>('/api/projects/paths', { query: { cwd } })
      return paths
    },

    async fetchProjects() {
      return useApiFetch<any[]>(`/api/projects`)
    },

    async handleGenerateInit(data: any) {
      return useApiFetch<any>('/api/generate/init', {
        method: 'post',
        body: {
          ...data,
          with_create: true
        }
      })
    },

    async handleGenerateController(data: any) {
      return useApiFetch('/api/generate/controller', { method: 'post', body: data })
    },

    async handleProjectAppdataCreate(cwd?: string) {
      if (cwd == null) {
        const $state = useStateStore()
        cwd = $state.paths?.project_path
      }
      return useApiFetch<any>('/api/projects/appdata', { method: 'post', body: { cwd } })
    },

    async handleProjectOpenInExplorer(cwd: string) {
      return useApiFetch('/api/projects/open_in_exporer', { query: { cwd } })
    },

    async handleProjectOpenInIntellijIdea(cwd: string) {
      return useApiFetch('/api/projects/open_in_idea', { query: { cwd } })
    },

    async handleProjectCreate(data: any) {
      return await useApiFetch<any>('/api/projects', {
        method: 'post',
        body: data
      })
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
      return useApiFetch(`/api/projects/${id}`, { method: 'delete' })
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
