import {NuxtConfig} from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(<NuxtConfig>{
  devtools: {
    enabled: true
  },

  ssr: true,

  app: {
    head: {
      title: 'Kraken UI'
    },
  },

  css: [
    '@/assets/app.scss'
  ],

  modules: [
    'nuxt-quasar-ui',
  ],

  quasar: {
    lang: 'fr',
    extras: {
      fontIcons: [
        'material-icons'
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

  experimental: {
    typedPages: true
  },

  runtimeConfig: {
    public: {
      API_PORT: process.env.API_PORT
    }
  }
})
