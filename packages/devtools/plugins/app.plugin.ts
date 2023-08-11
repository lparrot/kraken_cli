import { useAppBus } from '~/composables/useAppBus'

export default defineNuxtPlugin(async nuxt => {
  const { setMenu } = useAppMenu()
  const $state = useStateStore()
  const storage = useAppStorage()
  const $api = useApiStore()
  const $bus = useAppBus()

  $state.os_infos = await $api.fetchOsInfos()

  $bus.projects.on(async () => {
    $state.projects = await $api.fetchProjects()
  })

  $bus.projects.emit()

  watchEffect(() => {
    setMenu([
      {
        label: 'Général', items: [
          { label: 'Tableau de bord', to: '/', icon: 'i-ic-baseline-space-dashboard', showIf: storage.value.selected_project != null },
          { label: 'Créer projet', to: '/generator/init', icon: 'i-ic-create-new-folder' },
        ]
      },
      {
        label: 'Génération côté serveur', items: [
          { label: 'Controlleur', to: '/generator/controller', icon: 'i-mdi-api', showIf: storage.value.selected_project != null },
          { label: 'Referentiel', to: '/generator/ref', icon: 'i-ic-view-list', showIf: storage.value.selected_project != null },
          { label: 'Timer', to: '/generator/timer', icon: 'i-ic-schedule', showIf: storage.value.selected_project != null },
        ]
      },
      {
        label: 'Génération côté web', items: [
          { label: 'Page', to: '/generator/page', icon: 'i-ic-baseline-article', showIf: storage.value.selected_project != null },
          { label: 'Store', to: '/generator/store', icon: 'i-ic-save', showIf: storage.value.selected_project != null },
        ]
      }
    ])
  })
})
