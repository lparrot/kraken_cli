import {ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos} from "@kraken/types";

interface StateStore {
    appdata: ProjectAppData
    navigation: boolean
    os_infos: ServerInfos
    paths: ProjectPaths
    ping: boolean
    project: ProjectAttributes
    projects: ProjectAttributes[]
}

export const useStateStore = defineStore('state', {
    state: (): Partial<StateStore> => ({
        navigation: false,
        ping: false,
        projects: [],
    }),

    actions: {
        async fetchAppData() {
            this.appdata = await useApiStore().fetchAppData()
        },

        async fetchPing() {
            await useApiStore().handleProjectPing()
        },

        async setProject(id?: number) {
            const $api = useApiStore()
            const storage = useAppStorage()

            storage.value.selected_project = id

            if (id == null) {
                this.project = undefined
                this.paths = undefined
                this.appdata = undefined
                this.ping = false
                return
            }

            this.project = await $api.fetchProject(id!)

            if (this.project != null) {
                this.paths = await $api.fetchProjectPaths(this.project.path)
            }

            await this.getOrUpdateAppData()

            await this.fetchPing()

            return this.project
        },

        async getOrUpdateAppData() {
            const loader = useAppLoader()
            await this.fetchAppData()

            if (this.appdata == null) {
                loader.start({description: 'Génération du fichier appdata'})
                try {
                    this.appdata = await useApiStore().handleProjectAppdataCreate()
                } finally {
                    loader.stop()
                }
            }
        },
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}