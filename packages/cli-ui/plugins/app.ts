import {useStateStore} from "~/store/state";
import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents, SocketMessage} from "@kraken/types";
import {Loading} from "quasar";

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

  const config = useRuntimeConfig();
  let $io = null

  if (process.client) {
    $io = io(`ws://localhost:${config.public.API_PORT}`) as Socket<ServerToClientEvents, ClientToServerEvents>

    $io.on('logger:message', (message: SocketMessage) => {
      Notify.create({
        color: getColorByLevel(message),
        message: message.message,
      })
    })

    $io.on('loader:show', (message: string) => {
      if (appLoader == null) {
        appLoader = Loading.show({
          group: 'app-loader',
          message
        })
      } else {
        appLoader({
          message
        })
      }
    })

    $io.on('loader:hide', () => {
      appLoader()
      appLoader = null
    })

    const $state = useStateStore()

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
      io: $io
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $io: Socket

    $log(msg: string): string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $io: Socket

    $log(msg: string): string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $io: Socket

    $log(msg: string): string
  }
}

export {}
