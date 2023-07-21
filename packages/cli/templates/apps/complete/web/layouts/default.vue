<template>
  <layout ref="layout" fixed-elements>

    <template #header-logo>
      <nuxt-link #default="{ navigate }" class="cursor-pointer m-2" custom to="/">
        <p class="fr-logo fr-logo--sm" @click="navigate">
          Ministère
          <br>des Armées
        </p>

      </nuxt-link>
    </template>

    <!-- utilisation du slot 'user' -->
    <template #user="{user, loggedIn}">
      <!-- si l'utilisateur est connecté on affiche le login avec un lien pour se déconnecter-->
      <!-- si on clique sur le login, l'action onClickUsername est enclenchée-->
      <template v-if="loggedIn">
        <b-btn class="text-dark" variant="link" @click="onClickUsername(user)">{{ user.sub }}</b-btn>
        -
        <b-btn class="text-dark" variant="link" @click="logout">Deconnexion</b-btn>
      </template>
      <!-- si l'utilisateur n'est pas connecté, on affiche un lien vers la page de connextion-->
      <nuxt-link v-else #default="{ navigate }" :to="$auth.options.redirect.login" custom>
        <b-btn class="text-dark" variant="link" @click="navigate">Connexion</b-btn>
      </nuxt-link>
    </template>

    <template #content>
      <div class="container-fluid">
        <nuxt></nuxt>
      </div>
    </template>

  </layout>
</template>

<script>
import {Layout} from '@socle/ui/bootstrap';

export default {
  components: {
    Layout
  },

  methods: {
    async onClickUsername() {
      await this.$router.push('/profil')
    },

    async logout() {
      await this.$refs.layout.logout()
    },
  }
}
</script>
