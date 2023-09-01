<template>
  <section class="container">
    <login v-model="form">

    </login>
  </section>
</template>

<script>
export default {
  head: {
    title: 'Connexion'
  },

  data() {
    return {
      form: {}
    }
  },

  asyncData(ctx) {
    if (ctx.$auth.loggedIn) {
      ctx.redirect(ctx.$auth.options.redirect.home || '/')
    }
  },

  methods: {}
}
</script>
