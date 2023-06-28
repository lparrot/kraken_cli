<script setup lang="ts">
import {useStateStore} from "~/store/state";
import {convertPathToPackage} from "~/utils/java.utils";
import {useApiStore} from "~/store/api";
import {QInput} from "quasar";
import stringcase from "stringcase";
import deburr from "lodash/deburr";
import PageReferentielAfterCreate from "~/components/dialogs/PageReferentielAfterCreate.vue";
import sortBy from "lodash/sortBy";
import {ProjectAppDataEntity} from "@types/kraken";

definePageMeta({
  middleware: ['security']
})

interface Form {
  cwd: string
  dao_name: string
  entity_name: string
  id_type: string
  template: string
  url: string
}

const drawer = ref(false)
const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()
const templateOptions = [{label: 'Consultation', value: 'simple'}, {label: 'Consultation/Modification', value: 'crud'}]

let entity_files: any[] = []
let dao_files: any[] = []

if ($state.appdata?.entities != null) {
  entity_files = $state.appdata.entities.map(entity => ({value: entity.filePath, label: entity.type}))
  dao_files = $state.appdata.entities.map(entity => ({value: entity.dao?.filePath, label: entity.dao?.type}))
} else {
  entity_files = sortBy((await $api.fetchJavaFiles($state.paths.server_java_path)).map(path => ({value: path, label: convertPathToPackage(path)})), 'label')
  dao_files = entity_files
}


const entity_options = ref(entity_files)
const dao_options = ref(dao_files)

const form = ref<Partial<Form>>()

async function init() {
  form.value = {
    url: '/api/referentiels/',
    id_type: 'Long'
  }
}

await init()

async function submitForm() {
  $q.loading.show({message: 'Création du référentiel en cours ...'})

  try {
    await $api.handleGenerateReferentiel(form.value)
    $q.dialog({
      component: PageReferentielAfterCreate,
      componentProps: {
        referentiel: form.value
      }
    })
    await init()
    $q.notify({
      message: 'Référentiel créé avec succès',
      color: 'green'
    })
  } finally {
    $q.loading.hide()
  }
}

function filterEntityFn(val: string, update: any, abort: any) {
  update(() => {
    entity_options.value = entity_files.filter(it => it.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

function filterDaoFn(val: string, update: any, abort: any) {
  update(() => {
    dao_options.value = dao_files.filter(it => it.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

function onSelectEntity(entity, handleChange) {
  const entity_finded: ProjectAppDataEntity | undefined = $state.appdata.entities.find(it => it.type === entity.label)

  form.value.dao_name = entity_finded?.dao?.filePath
  form.value.url = `/api/referentiels/${entity_finded?.name.toLowerCase()}`
  form.value.id_type = entity_finded?.attributes!.find(it => it.id === true)?.type

  handleChange(entity.value)
}

const defaultSelectedPackage = ref(await $api.fetchJavaRootDir($state.paths?.server_java_path))

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
      <FileFetcher v-model="form.cwd" :default-dir="defaultSelectedPackage" :root="$state.paths?.server_java_path"/>
    </q-drawer>

    <VeeForm #default="{isSubmitting}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
      <q-btn :color="form?.cwd == null ? 'blue' : 'green'" class="full-width" no-caps @click="drawer = true">
        <span v-if="form?.cwd == null">Selectionnez un package</span>
        <span v-else>Modifier le package</span>
      </q-btn>

      <template v-if="form?.cwd != null">
        <div class="row items-center q-gutter-xs">
          <q-icon color="orange" name="folder"/>
          <div class="text-subtitle2">{{ selectedPackage }}</div>
        </div>

        <q-separator/>

        <VeeField #default="{errorMessage, meta, field}" label="template" name="template" rules="required">
          <q-select v-model="form.template" :error="!meta.valid" :error-message="errorMessage" :options="templateOptions" dense emit-value filled hide-bottom-space label="Type de réferentiel" map-options options-dense stack-label v-bind="field"/>
        </VeeField>

        <VeeField v-model="form.entity_name" #default="{errorMessage, meta, field, value, handleChange}" label="classe de l'entité" name="entity_name" rules="required">
          <q-select :error="!meta.valid" :error-message="errorMessage" :model-value="value" :options="entity_options" clearable dense fill-input filled hide-bottom-space hide-selected input-debounce="400" label="Classe de l'entité ?" map-options options-dense stack-label use-input @filter="filterEntityFn" @update:model-value="onSelectEntity($event, handleChange)"/>
        </VeeField>

        <template v-if="form.entity_name">
          <VeeField v-model="form.dao_name" #default="{errorMessage, meta, field, value, handleChange}" emit-value label="class de la dao" name="dao_name" rules="required">
            <q-select :error="!meta.valid" :error-message="errorMessage" :model-value="value" :options="dao_options" clearable dense emit-value fill-input filled hide-bottom-space hide-selected input-debounce="400" label="Classe de la DAO ?" map-options options-dense stack-label use-input @filter="filterDaoFn" @update:model-value="handleChange"/>
          </VeeField>

          <VeeField #default="{errorMessage, meta, field}" label="url" name="url" rules="required">
            <q-input v-model="form.url" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Url du webservice" stack-label v-bind="field" @update:model-value="form.url = deburr(stringcase.pathcase($event))"/>
          </VeeField>

          <VeeField #default="{errorMessage, meta, field}" label="type de propriété @Id" name="id_type" rules="required">
            <q-input v-model="form.id_type" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Type de la propriété @Id" stack-label v-bind="field"/>
          </VeeField>

          <q-btn color="primary" icon="add_circle" label="Créer le référentiel" type="submit"/>
        </template>

      </template>
    </VeeForm>
  </q-layout>
</template>

<style scoped>

</style>
