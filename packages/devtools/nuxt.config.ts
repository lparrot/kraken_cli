import {NuxtConfig} from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(<NuxtConfig>{
  ssr: true,

  telemetry: false,

  app: {
    head: {
      title: 'Kraken UI'
    },
  },

  css: [
    'prismjs/themes/prism.css',
    'prismjs/plugins/toolbar/prism-toolbar.css',
    '@/assets/app.scss'
  ],

  modules: [
    'nuxt-quasar-ui',
    '@vee-validate/nuxt',
    '@pinia/nuxt'
  ],

  buildModules: [
    '@vueuse/nuxt'
  ],

  typescript: {
    tsConfig: {}
  },

  nitro: {
    preset: 'node-server'
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      }
    },
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.API_PORT || 8080}`,
          changeOrigin: true,
        },
        '/socket.io': {
          target: `http://localhost:${process.env.API_PORT || 8080}`,
          changeOrigin: true,
          // ws: true,
        },
      }
    }
  },

  quasar: {
    lang: 'fr',
    iconSet: 'material-icons',
    extras: {
      fontIcons: [
        'material-icons',
        'mdi-v7'
      ]
    },
    plugins: [
      'Dialog',
      'Notify',
      'Loading'
    ],
    config: {
      notify: {
        position: 'bottom-right'
      },
      brand: {
        primary: '#49b35c',
        secondary: '#3f8a82',
        accent: '#276eb0',

        dark: '#1d1d1d',
        'dark-page': '#121212',

        positive: '#0b8527',
        negative: '#C10015',
        info: '#66e5ff',
        warning: '#F2C037'
      }
    }
  },

  veeValidate: {
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    }
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },

  experimental: {
    typedPages: true,
  },

  runtimeConfig: {
    public: {
      API_PORT: process.env.API_PORT
    }
  }
})
