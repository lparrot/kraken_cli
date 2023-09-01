<template>
  <section class="container-fluid">
    <b-card-group>
      <profile-change-password :submit-method="onChangePasswordSubmit" class="border-0 mx-2"></profile-change-password>

      <profile-actions class="border-0 mx-2" @on-action="onAction"></profile-actions>
    </b-card-group>
  </section>
</template>

<script>
export default {
  head: {
    title: 'Profil'
  },

  access: [],

  data() {
    return {}
  },

  async fetch() {

  },

  methods: {
    async onAction(event) {
      switch (event.type) {
        case 'disassociate':
          await event.handler()
          this.$app.toast({message: `Votre compte machine a été disassocié du compte de l'application`, variant: 'success'})
          break
        case 'personal_data':
          await event.handler()
          break
        case 'droit_oubli':
          const response = await this.$app.confirm({message: `Etes vous sûr de vouloir faire valoir votre droit à l'oubli ?`})
          if (response) {
            await event.handler()
            this.$app.toast({message: `Vos données personnelles ont bien été supprimées`, variant: 'success'})
          }
          break
        default:
          break
      }
    },

    onChangePasswordSubmit(form) {
      this.$app.message({message: `Le mot de passe n'est pas modifié, aucun webservice n'a été envoyé`})
    },
  }
}
</script>
