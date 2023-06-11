<script setup lang="ts">
import {sentencecase} from "stringcase";
import kebabCase from "lodash/kebabCase";
import {QInput} from "quasar";

interface Form {
  nom: string
  title: string
}

const $q = useQuasar()

const form = ref<Partial<Form>>()
const readonly_inputs = ref()

function init() {
  form.value = {}
  readonly_inputs.value = {title: true}
}

init()

async function onSubmit() {
  $q.loading.show({message: 'Création de la page en cours ...'})
  try {
    const {success} = await useApiFetch('/api/generate/page', {
      method: 'post',
      body: {
        name: form.value.nom,
        title: form.value.title
      }
    })
    if (success) {
      $q.notify({
        message: 'Création de la page effectuée avec succès',
        color: 'green'
      })
      init()
    }
  } finally {
    $q.loading.hide()
  }
}

watch(
  () => form.value.nom,
  () => {
    if (readonly_inputs.value.title) {
      form.value.title = sentencecase(kebabCase(form.value.nom!))
    }
  }
)
</script>

<template>
  <q-page padding>
    <q-form class="column q-gutter-y-md" @submit.prevent="onSubmit">
      <q-input v-model="form.nom" clearable label="Nom du fichier (sans l'extension .vue)" stack-label standout/>

      <q-input ref="input_title" v-model="form.title" :readonly="readonly_inputs.title" clearable label="Titre de la page" stack-label standout>
        <template #append>
          <q-btn v-if="readonly_inputs.title" dense flat icon="edit" round @click="readonly_inputs.title = !readonly_inputs.title"/>
        </template>
      </q-input>

      <q-btn color="primary" icon="add_circle" label="Créer la page" type="submit"/>
    </q-form>
  </q-page>
</template>

<style scoped>

</style>
