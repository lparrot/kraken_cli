import {helpers} from '@socle/core'
import {NuxtConfig} from '@nuxt/types'

const is_dev = process.env.NODE_ENV === 'development'
const app_context = '<%= artifact_id %>'

/**
 * @type {NuxtConfig}
 */
const configuration = {
  // Désactive le mode SSR (Server Side Rendering)
  ssr: false,

  // Type de configuration
  target: 'static',

  static: {
    // Aucun préfixe ne sera rajouté au niveau du baseUrl pour les images par exemple
    prefix: false,
  },

  generate: {
    dir: 'target/dist',
  },

  /*
  ** Headers de la page
  */
  head: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? titleChunk + ' - <%= name %>' : '<%= name %>'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: '${description}'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
    ],
  },

  /*
  ** Personnalisation de la barre de chargement
  */
  loading: {color: '#fff'},

  /*
  loading: true,
  loadingIndicator: {
    name: 'chasing-dots',
    color: '#3B8070',
    background: 'var(--light)',
  },
  */

  /*
  ** Styles CSS / SCSS
  */
  css: [
    '@socle/ui/themes/dsfr.style.scss',
    '@/assets/styles/app.scss',
  ],

  /*
  ** Plugins qui seront executés avant l'instanciation de l'application
  */
  plugins: [
    '@/kraken.config'
  ],

  /*
  ** Modules de type 'dev' de Nuxt.js
  */
  buildModules: [],

  /*
  ** Modules Nuxt.js
  */
  modules: [
    '@socle/core',
    '@socle/admin',
    '@socle/security',
  ],

  /*
  ** Configuration pour la construction du projet
  */
  build: {
    extractCSS: true,
    optimizeCSS: true,

    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler'),
      },
    },

    /*
    ** Permet d'étendre la configuration de webpack
    */
    extend(config, ctx) {
    },
  },

  /*
  ** Paramètre d'appel de webservices
  */
  axios: {
    proxy: true,
  },

  /*
  ** Paramètrage du proxy
  */
  proxy: {
    /*
    ** Proxy pour l'appel des webservices d'API en développement
    */
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: false,
    },
  },

  /**
   * Evite les doublons de CSS dans les pages
   */
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: true,
  },

  /*
   ** Configuration du socle
   */
  socle: {
    apiPrefix: '/api',
    apiDebug: is_dev,
    useBaseUrl: false,
  },
}

helpers.nuxtConfigurationWithTomcat(configuration, {context: app_context})

export default configuration
