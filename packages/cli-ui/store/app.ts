import {ProjectAttributes, ProjectPath} from "kraken";

interface State {
  project?: ProjectAttributes
  projects: ProjectAttributes[]
  paths?: ProjectPath
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    project: undefined,
    projects: [],
    paths: undefined
  }),

  actions: {
    async fetchProjects() {
      this.projects = await useApiFetch<ProjectAttributes[]>('/api/projects')
    },

    async setProject(id?: number | null) {
      if (id == null) {
        this.project = undefined
        this.paths = undefined
      }
      this.project = await useApiFetch<ProjectAttributes>(`/api/projects/${id}`)
      if (this.project != null) {
        this.paths = await useApiFetch('/api/paths', {
          params: {
            path: this.project.path
          }
        })
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
