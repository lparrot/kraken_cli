import {
    ClientToServerDevtoolsEvents,
    ClientToServerEvents,
    ProjectAppData,
    ProjectAttributes,
    ProjectPaths,
    ServerInfos,
    ServerToClientDevtoolsEvents,
    ServerToClientEvents
} from '@kraken/types'
import {useApiStore} from '~/store/api'
import {io, Socket} from 'socket.io-client'
import {useEventBus} from '@vueuse/core'

interface State {
  project?: ProjectAttributes
  projects: ProjectAttributes[]
  paths?: ProjectPaths
  infos?: ServerInfos
  appdata?: ProjectAppData
  projectPing: boolean,
  logs: string[]
    io?: Socket<ServerToClientEvents, ClientToServerEvents>,
    ioDevtools?: Socket<ServerToClientDevtoolsEvents, ClientToServerDevtoolsEvents>
}

export const useStateStore = defineStore('app', {
  state: (): State => ({
    project: undefined,
    projects: [],
    paths: undefined,
    infos: undefined,
    appdata: undefined,
    projectPing: false,
      logs: [],
      io: undefined,
      ioDevtools: undefined
  }),

  actions: {
    async fetchPing() {
      await useApiStore().handleProjectApiPing()

        if (this.projectPing) {
            this.io = io('http://localhost:1337')

            const busAction = useEventBus('server:action')

            this.io.on('server:action', message => {
                busAction.emit(message)
            })

            this.io.on('server:status', async message => {
                await this.fetchPing()
            })
        }
    },

    async fetchLogs() {
      this.logs = await useApiStore().handleProjectApiLogs(this.project?.id)
    },

    async fetchAppData() {
      this.appdata = await useApiStore().fetchAppData()
    },

    async fetchProjects() {
      this.projects = await useApiStore().fetchProjects()
    },

    async fetchServerInfos() {
      this.infos = await useApiStore().fetchInfos()
    },

    async setProject(id?: number) {
      const $api = useApiStore()
      const storage = useKrakenSessionStorage()

      storage.value.selection.project = id

      if (id == null) {
        this.project = undefined
        this.paths = undefined
        return
      }

      this.project = await $api.fetchProject(id!)

      if (this.project != null) {
        this.paths = await $api.fetchProjectPaths(this.project.path)
      }

      return this.project
    },

    async getOrUpdateAppData() {
      await this.fetchAppData()

      if (this.appdata == null) {
        Loading.show({ message: 'Génération du fichier appdata' })
        try {
          this.appdata = await useApiStore().handleRefreshAppData()
        } finally {
          Loading.hide()
        }
      }
    },

      initDevtoolsIo() {
          this.ioDevtools = io()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}
