export default defineNuxtPlugin(nuxt => {
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
    if (process.client) {
      console.error(..._args)
    }
  }

  return {
    provide: {
      log: console.log
    }
  }
})
