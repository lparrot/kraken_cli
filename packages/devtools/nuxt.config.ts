// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  telemetry: false,

  app: {
    head: {
      title: 'Devtools',
      titleTemplate: '%s - Devtools'
    }
  },

  build: {
    transpile: ['@vueuse/core']
  },

  vue: {
    defineModel: true
  },

  experimental: {
    typedPages: true,
  },

  css: ['@/assets/scss/global.scss'],

  imports: {
    dirs: ['stores']
  },

  devServer: {
    port: Number(process.env.DEV_PORT) || 3000
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.API_PORT || 8080}`,
          changeOrigin: true,
        },
        '/socket.io': {
          target: `http://localhost:${process.env.API_PORT || 8080}`,
          changeOrigin: true,
        },
      }
    }
  },

  modules: [
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-lodash',
  ],

  typescript: {
    tsConfig: {}
  },

  nitro: {
    preset: 'node-server'
  },

  ui: {
    global: true,
    icons: ['mdi', 'ic', 'heroicons'],
  },

  vueuse: {
    autoImports: true
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },

  veeValidate: {
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    }
  },
})
