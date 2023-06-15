export default defineNuxtPlugin(nuxt => {
  nuxt.hook('vue:error', (..._args) => {
    console.log('vue:error')
    // if (process.client) {
    //   console.log(..._args)
    // }
  })

  nuxt.hook('app:error', (..._args) => {
    console.log('app:error')
    // if (process.client) {
    //   console.log(..._args)
    // }
  })

  nuxt.vueApp.config.errorHandler = (..._args) => {
    console.log('global error handler')
    // if (process.client) {
    //   console.log(..._args)
    // }
  }

  return {
    provide: {
      log: console.log
    }
  }
})
