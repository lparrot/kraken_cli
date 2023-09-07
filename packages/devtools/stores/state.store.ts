import {ProjectAppData, ProjectAttributes, ProjectPaths, ServerInfos} from '@kraken/types'

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
        appdata: undefined,
        navigation: false,
        os_infos: undefined,
        paths: undefined,
        ping: false,
        project: undefined,
        projects: [],
    }),

    actions: {
        async fetchAppData() {
            this.appdata = await useApiStore().fetchAppData()
        },

        async fetchPing() {
            await useApiStore().handleProjectPing()
        },

        async refreshSelectedProject() {
            const $loader = useAppLoader()
            const $storage = useAppStorage()

            $loader.start()
            try {
                await this.setProject($storage.value.selected_project)
            } finally {
                $loader.stop()
            }
        },

        unselectProject() {
            const $storage = useAppStorage()

            this.project = undefined
            this.paths = undefined
            this.appdata = undefined
            this.ping = false
            $storage.value.selected_project = undefined
        },

        async setProject(id?: number) {
            const $api = useApiStore()
            const $storage = useAppStorage()

            if (id == null) {
                this.unselectProject()
                return
            }

            this.project = await $api.fetchProject(id!)

            if (this.project == null) {
                this.unselectProject()
                return
            }

            $storage.value.selected_project = id

            this.paths = await $api.fetchProjectPaths(this.project.path)

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
