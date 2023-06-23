<script setup lang="ts">
import {useStateStore} from "~/store/state";
import {convertPathToPackage} from "~/utils/java.utils";
import {useApiStore} from "~/store/api";

definePageMeta({
  middleware: ['security']
})

interface Form {
  cwd: string
  dao_name: { value: string, label: string }
  entity_name: { value: string, label: string }
  id_type: string
  template: string
  url: string
}

const drawer = ref(false)
const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()
const templateOptions = [{label: 'Consultation', value: 'simple'}, {label: 'Consultation/Modification', value: 'crud'}]
const java_files = (await $api.fetchJavaFiles($state.paths.server_java_path)).map(path => ({value: path, label: convertPathToPackage(path)}))
const entity_options = ref(java_files)

const form = ref<Partial<Form>>()

async function init() {
  form.value = {}
}

await init()

async function submitForm() {
  $q.loading.show({message: 'Création du référentiel en cours ...'})

  try {

    await init()
  } finally {
    $q.loading.hide()
  }
}

function filterEntityFn(val: string, update, abort) {
  update(() => {
    entity_options.value = java_files.filter(it => it.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

const defaultSelectedPackage = ref(await $api.fetchJavaRootDir($state.paths.server_java_path))

const selectedPackage = computed(() => {
  if (form.value?.cwd != null) {
    return convertPathToPackage(form.value.cwd)
  }
})
</script>

<template>
  <q-layout>
    <q-drawer v-model="drawer" :width="500" behavior="mobile" bordered overlay side="right">
      <div class="row items-center q-ma-sm">
        <q-space/>
        <q-btn dense flat icon="close" round @click="drawer = false"/>
      </div>
      <FileFetcher v-model="form.cwd" :default-dir="defaultSelectedPackage" :root="$state.paths.server_java_path"/>
    </q-drawer>

    <VeeForm #default="{isSubmitting}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
      <q-btn :color="form.cwd == null ? 'blue' : 'green'" class="full-width" no-caps @click="drawer = true">
        <span v-if="form.cwd == null">Selectionnez un package</span>
        <span v-else>Modifier le package</span>
      </q-btn>

      <template v-if="form.cwd != null">
        <div class="row items-center q-gutter-xs">
          <q-icon color="orange" name="folder"/>
          <div class="text-subtitle2">{{ selectedPackage }}</div>
        </div>

        <q-separator/>

        <VeeField #default="{errorMessage, meta, field}" label="template" name="template" rules="required">
          <q-select v-model="form.template" :error="!meta.valid" :error-message="errorMessage" :options="templateOptions" dense emit-value filled hide-bottom-space label="Type de réferentiel" options-dense stack-label v-bind="field"/>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="entité" name="entity_name" rules="required">
          <q-select v-model="form.entity_name" :error="!meta.valid" :error-message="errorMessage" :options="entity_options" dense fill-input filled hide-bottom-space hide-selected input-debounce="400" label="Classe de l'entité ?" options-dense stack-label use-input v-bind="field" @filter="filterEntityFn">
            <template #selected>
              {{ form.entity_name?.label }}
            </template>

            <template #no-option>
              <q-item dense>
                <q-item-section class="text-grey">
                  Aucun résultat
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </VeeField>
      </template>
    </VeeForm>
    <pre>{{ form }}</pre>
  </q-layout>
</template>

<style scoped>

</style>
