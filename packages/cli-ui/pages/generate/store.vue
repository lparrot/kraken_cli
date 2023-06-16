<script setup lang="ts">
import {QInput} from "quasar";
import stringcase from "stringcase";
import deburr from "lodash/deburr";

const $q = useQuasar()
const project = useState('project')

const form = ref({})

function init() {
  form.value = {}
}

init()

async function submitForm() {
  $q.loading.show({message: 'Création du store en cours ...'})
  try {
    await useApiFetch('/api/generate/store', {
      method: 'post',
      body: {
        cwd: project.value.path,
        name: form.value.name
      }
    })
    $q.notify({
      message: 'Création du store effectuée avec succès',
      color: 'green'
    })
    init()
  } finally {
    $q.loading.hide()
  }
}
</script>

<template>
  <VeeForm #default="{isSubmitting}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
    <VeeField #default="{errorMessage, meta, field}" name="name" rules="required">
      <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Nom du fichier du store (sans extension)" stack-label v-bind="field" @update:model-value="form.name = deburr(stringcase.pathcase($event))"/>
    </VeeField>

    <q-btn color="primary" icon="add_circle" label="Créer le store" type="submit"/>
  </VeeForm>
</template>

<style scoped>

</style>
