import {ProjectAttributes, ProjectPaths, ServerInfos} from "kraken";
import {useApiStore} from "~/store/api";

interface State {
  project?: ProjectAttributes
  projects: ProjectAttributes[]
  paths?: ProjectPaths
  infos?: ServerInfos
}

export const useStateStore = defineStore('app', {
  state: (): State => ({
    project: undefined,
    projects: [],
    paths: undefined,
    infos: undefined
  }),

  actions: {
    async fetchProjects() {
      this.projects = await useApiFetch<ProjectAttributes[]>('/api/projects')
    },

    async fetchServerInfos() {
      this.infos = await useApiStore().fetchInfos()
    },

    async setProject(id?: number | null) {
      if (id == null) {
        this.project = undefined
        this.paths = undefined
      }
      this.project = await useApiFetch<ProjectAttributes>(`/api/projects/${id}`)
      if (this.project != null) {
        this.paths = await useApiStore().fetchProjectPaths(this.project.path)
      }

      return this.project
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}
