<template>
  <section class="container">
    <login v-model="form">

    </login>
  </section>
</template>

<script>
import {Login} from "@socle/security/bootstrap";

export default {
  head: {
    title: 'Connexion'
  },

  components: {
    Login
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
