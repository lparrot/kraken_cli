import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";

export default defineNuxtPlugin(async nuxt => {
  if (process.client) {
    const $state = useStateStore()
    const $api = useApiStore()

    await $state.fetchServerInfos()
    await $state.fetchProjects()

    const storage = useKrakenSessionStorage()

    if (storage.value.selection.project != null) {
      await $state.setProject(storage.value.selection.project)
    }

    nuxt.hook('vue:error', (..._args) => {
      // if (process.client) {
      //   console.log(..._args)
      // }
    })

    nuxt.hook('app:error', (..._args) => {
      // if (process.client) {
      //   console.log(..._args)
      // }
    })

    nuxt.vueApp.config.errorHandler = (..._args) => {
      if (process.client && (<any>_args[0])?.name !== 'FetchError') {
        console.error(..._args)
      }
    }
  }

  return {
    provide: {
      log: console.log
    }
  }
})
