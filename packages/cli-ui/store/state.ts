import {ProjectAttributes, ProjectServerInfos} from "kraken";
import {useApiStore} from "~/store/api";

interface State {
  project?: ProjectAttributes
  projects: ProjectAttributes[]
  infos?: ProjectServerInfos
}

export const useStateStore = defineStore('app', {
  state: (): State => ({
    project: undefined,
    projects: [],
    infos: undefined
  }),

  actions: {
    async fetchProjects() {
      this.projects = await useApiFetch<ProjectAttributes[]>('/api/projects')
    },

    async setProject(id?: number | null) {
      if (id == null) {
        this.project = undefined
        this.infos = undefined
      }
      this.project = await useApiFetch<ProjectAttributes>(`/api/projects/${id}`)
      if (this.project != null) {
        this.infos = await useApiStore().fetchInfos(this.project.path)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}
