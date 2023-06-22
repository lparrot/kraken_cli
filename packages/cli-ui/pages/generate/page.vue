<script setup lang="ts">
import stringcase, {sentencecase} from "stringcase";
import kebabCase from "lodash/kebabCase";
import {QInput} from "quasar";
import deburr from 'lodash/deburr'
import {useStateStore} from "~/store/state";

interface Form {
  name: string
  title: string
}

interface ReadOnlyInputs {
  title: boolean
}

const $q = useQuasar()
const $state = useStateStore()

const form = ref<Partial<Form>>()
const readonly_inputs = ref<ReadOnlyInputs>()

function init() {
  form.value = {}
  readonly_inputs.value = {title: true}
}

init()

async function submitForm() {
  $q.loading.show({message: 'Création de la page en cours ...'})
  try {
    const {success} = await useApiFetch('/api/generate/page', {
      method: 'post',
      body: {
        name: form.value.name,
        title: form.value.title,
        cwd: $state.project.path
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
  () => form.value.name,
  () => {
    if (readonly_inputs.value.title) {
      form.value.title = sentencecase(kebabCase(form.value.name!))
    }
  }
)
</script>

<template>
  <VeeForm #default="{isSubmitting}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
    <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required">
      <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Nom du fichier (sans l'extension .vue)" stack-label v-bind="field" @update:model-value="form.name = deburr(stringcase.pathcase($event))"/>
    </VeeField>

    <q-input ref="input_title" v-model="form.title" :readonly="readonly_inputs.title" dense filled label="Titre de la page" stack-label>
      <template #append>
        <q-btn v-if="readonly_inputs.title" dense flat icon="edit" round @click="readonly_inputs.title = !readonly_inputs.title"/>
      </template>
    </q-input>

    <q-btn color="primary" icon="add_circle" label="Créer la page" type="submit"/>
  </VeeForm>
</template>

<style scoped>

</style>
