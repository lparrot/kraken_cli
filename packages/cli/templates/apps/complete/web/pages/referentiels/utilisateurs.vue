<template>
  <section class="container-fluid">
    <referentiel :on-before-show-modal="onBeforeShowModal" state-id="<%= artifact_id %>.ref_admin_utilisateur" state-provider="localstorage" url="/api/referentiels/utilisateurs">
      <template #cell(profil)="{item}">
        <span>{{ item.profilLibelle }}</span>
      </template>

      <template #modal-edit="{selected}">
        <validation-provider #default="{errors, valid}" rules="required">
          <b-form-group :invalid-feedback="errors[0]" :state="valid" label="Nom d'utilisateur">
            <b-form-input v-model="selected.username" :state="valid"/>
          </b-form-group>
        </validation-provider>

        <validation-provider #default="{errors, valid}" rules="required|email">
          <b-form-group :invalid-feedback="errors[0]" :state="valid" label="E-mail">
            <b-form-input v-model="selected.email" :state="valid"/>
          </b-form-group>
        </validation-provider>

        <validation-provider #default="{errors, valid}" rules="required">
          <b-form-group :invalid-feedback="errors[0]" :state="valid" label="Profil">
            <b-form-select v-model="selected.profilId" :options="$store.state.app.profils"/>
          </b-form-group>
        </validation-provider>
      </template>
    </referentiel>
  </section>
</template>

<script>
export default {
  head: {
    title: 'Référentiel utilisateurs'
  },

  data() {
    return {
      profils: []
    }
  },

  async fetch() {
  },

  methods: {
    async onBeforeShowModal() {
      await this.$store.dispatch('app/fetchProfils')
    }
  }
}
</script>
