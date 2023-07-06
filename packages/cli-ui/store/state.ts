import {ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos} from "@kraken/types";
import {useApiStore} from "~/store/api";

interface State {
  project?: ProjectAttributes
  projects: ProjectAttributes[]
  paths?: ProjectPaths
  infos?: ServerInfos
  appdata?: ProjectAppData
}

export const useStateStore = defineStore('app', {
  state: (): State => ({
    project: undefined,
    projects: [],
    paths: undefined,
    infos: undefined,
    appdata: undefined
  }),

  actions: {
    async fetchAppData() {
      this.appdata = await useApiStore().fetchAppData()
    },

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
        const $api = useApiStore();
        this.paths = await $api.fetchProjectPaths(this.project.path)
      }

      return this.project
    },

    async getOrUpdateAppData() {
      await this.fetchAppData()

      if (this.appdata == null) {
        Loading.show({message: 'Génération du fichier appdata'})
        try {
          this.appdata = await useApiStore().handleRefreshAppData()
        } finally {
          Loading.hide()
        }
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}
