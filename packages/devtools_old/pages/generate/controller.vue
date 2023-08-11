<script setup lang="ts">
import {useStateStore} from '~/store/state'
import {useApiStore} from '~/store/api'
import {convertPathToPackage} from '~/utils/java.utils'
import deburr from 'lodash/deburr'
import stringcase, {pathcase} from 'stringcase'
import {FormContext} from "vee-validate";
import {validateFields} from "~/utils/vue.utils";

definePageMeta({
  middleware: ['security']
})

interface Form {
  cwd: string
  name: string
  url: string
}

interface ReadOnlyInputs {
  url: boolean
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()

const drawer = ref(false)
const form = ref<Partial<Form>>({})
const readonly_inputs = ref<Partial<ReadOnlyInputs>>({})
const field_url = ref()
const validator = ref<FormContext>()

async function init() {
  form.value = {
    cwd: await $api.fetchJavaRootDir($state.paths?.server_java_path!)
  }

  readonly_inputs.value = {
    url: true
  }
}

await init()

async function submitForm() {
  $q.loading.show({message: 'Création du controller en cours ...'})

  try {
    await $api.handleGenerateController(form.value)
    await init()
    $q.notify({
      message: 'Controlleur et service créés avec succès',
      color: 'green'
    })
  } finally {
    $q.loading.hide()
  }
}

const selectedPackage = computed(() => {
  if (form.value?.cwd != null) {
    return convertPathToPackage(form.value.cwd)
  }
})

watch(
    () => form.value?.name,
    async (newVal) => {
      if (readonly_inputs.value?.url) {
        form.value.url = pathcase('/api' + newVal)
        await validateFields(validator.value!, ['url'])
      }
    }
)
</script>

<template>
  <q-drawer v-model="drawer" :width="500" behavior="mobile" overlay side="right">
    <FileFetcher v-model="form.cwd" :root="$state.paths?.server_java_path"/>
  </q-drawer>

  <VeeForm ref="validator" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
    <q-btn :color="form.cwd == null ? 'blue' : 'green'" class="full-width" no-caps @click="drawer = true">
      <span v-if="form.cwd == null">Selectionnez un package</span>
      <span v-else>Modifier le package</span>
    </q-btn>

    <template v-if="form.cwd != null">

      <div class="row items-center q-gutter-xs">
        <q-icon color="orange" name="folder"/>
        <div class="text-subtitle2">{{ selectedPackage }}</div>
      </div>

      <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required" validate-on-change>
        <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space
                 label="Nom du controller (sans suffixe)" stack-label v-bind="field"
                 @update:model-value="form.name = deburr(stringcase.pascalcase($event as string))"/>
      </VeeField>

      <VeeField #default="{errorMessage, meta, field}" label="url" name="url" rules="required"
                validate-on-change>
        <q-input v-model="form.url" :error="!meta.valid" :error-message="errorMessage" :readonly="readonly_inputs.url"
                 dense filled hide-bottom-space label="Url du webservice" stack-label v-bind="field"
                 @update:model-value="form.url = deburr(stringcase.lowercase($event as string))">
          <template #append>
            <q-btn v-if="readonly_inputs.url" dense flat icon="edit" round tabindex="-1"
                   @click="readonly_inputs.url = !readonly_inputs.url"/>
          </template>
        </q-input>
      </VeeField>

      <q-btn color="primary" icon="add_circle" label="Créer le controlleur" type="submit"/>
    </template>

  </VeeForm>
</template>

<style scoped>

</style>
