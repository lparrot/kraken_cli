import {useStateStore} from '~/store/state'
import {SocketMessage} from '@kraken/types'

function getColorByLevel(message: SocketMessage) {
  switch (message.level) {
    case 'info':
      return 'info'
    case 'warn':
      return 'warning'
    case 'error':
      return 'negative'
    case 'success':
      return 'positive'
    default:
      return ''
  }
}

let appLoader: any = null

export default defineNuxtPlugin(async nuxt => {

    const config = useRuntimeConfig()
  if (process.client) {
    const $state = useStateStore()

      $state.initDevtoolsIo()

    await $state.fetchServerInfos()
    await $state.fetchProjects()

    const storage = useKrakenSessionStorage()

    if (storage.value.selection.project != null) {
      await $state.setProject(storage.value.selection.project)
    }

    await $state.getOrUpdateAppData()

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
      log: console.log,
    }
  }
})

declare module '#app' {
    interface NuxtApp {
        $log(msg: string): string
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $log(msg: string): string
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $log(msg: string): string
    }
}

export {}
