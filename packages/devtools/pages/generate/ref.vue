<script setup lang="ts">
import {useStateStore} from "~/store/state";
import {convertPathToPackage} from "~/utils/java.utils";
import {useApiStore} from "~/store/api";
import {QInput} from "quasar";
import stringcase, {sentencecase, snakecase} from "stringcase";
import deburr from "lodash/deburr";
import PageReferentielAfterCreate from "~/components/dialogs/PageReferentielAfterCreate.vue";
import sortBy from "lodash/sortBy";
import pluralize from "pluralize";
import {ProjectAppDataEntity} from "@kraken/types";

definePageMeta({
  middleware: ['security']
})

interface Form {
  cwd: string
  dao: any
  entity: any
  id_type: string
  template: string
  url: string
  fields: any[],
  with_page: boolean
  page_name?: string
  page_title?: string
}

const drawer = ref(false)
const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()
const templateOptions = [{label: 'Consultation', value: 'simple'}, {label: 'Consultation/Modification', value: 'crud'}]

let entity_files: any[] = []
let dao_files: any[] = []

if ($state.appdata?.entities != null) {
  entity_files = $state.appdata.entities
  dao_files = $state.appdata.entities.map(entity => entity.dao)
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
    id_type: 'Long',
    fields: [],
    with_page: true
  }
}

await init()

async function submitForm() {
  $q.loading.show({message: 'Création du référentiel en cours ...'})

  try {
    await $api.handleGenerateReferentiel({...form.value, entity_name: form.value?.entity.file_path, dao_name: form.value?.dao.file_path})
    $q.dialog({
      component: PageReferentielAfterCreate,
      componentProps: {
        data: form.value
      }
    })
    // await init()
  } finally {
    $q.loading.hide()
  }
}

function filterEntityFn(val: string, update: any, abort: any) {
  update(() => {
    entity_options.value = entity_files.filter(it => it.type?.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

function filterDaoFn(val: string, update: any, abort: any) {
  update(() => {
    dao_options.value = dao_files.filter(it => it.type?.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

function onSelectEntity(entity: ProjectAppDataEntity, handleChange) {
  handleChange(entity)

  form.value.dao = entity?.dao
  form.value.url = `/api/referentiels/${pluralize(snakecase(entity.name))}`
  form.value.id_type = entity.attributes!.find(it => it.id === true)?.type!
  form.value.page_name = `referentiels/${pluralize(snakecase(entity.name))}`
  form.value.page_title = `Référentiel des ${pluralize(sentencecase(entity.name).toLowerCase())}`

}

function onSelectDao(dao, handleChange) {
  handleChange(dao)
}

const defaultSelectedPackage = ref(await $api.fetchJavaRootDir($state.paths?.server_java_path))

const selectedPackage = computed(() => {
  if (form.value?.cwd != null) {
    return convertPathToPackage(form.value.cwd)
  }
})

const selected_entity_attributes_options = computed(() => {
  return sortBy(form.value.entity.attributes?.filter(it => it.id == null).map(att => ({label: att.name, value: {...att, persistent_type_data: getPersistentTypeData(att.persistent_type)}})), [o => o.value.persistent_type != null])
})
</script>

<template>
  <q-drawer v-model="drawer" :width="500" behavior="mobile" bordered overlay side="right">
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

      <VeeField v-model="form.entity" #default="{errorMessage, meta, field, value, handleChange}" label="classe de l'entité" name="entity" rules="required">
        <q-select :error="!meta.valid" :error-message="errorMessage" :model-value="value" :options="entity_options" dense fill-input filled hide-bottom-space hide-selected input-debounce="400" label="Classe de l'entité ?" option-label="type" options-dense stack-label use-input @filter="filterEntityFn" @update:model-value="onSelectEntity($event, handleChange)">
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>{{ scope.opt.type_simple }}</q-item-section>
              <q-item-section side><span class="text-caption text-grey-6">{{ scope.opt.type }}</span></q-item-section>
            </q-item>
          </template>
        </q-select>
      </VeeField>

      <template v-if="form.entity">
        <VeeField v-model="form.dao" #default="{errorMessage, meta, field, value, handleChange}" label="class de la dao" name="dao" rules="required">
          <q-select :disable="$state.appdata?.entities != null" :error="!meta.valid" :error-message="errorMessage" :model-value="value" :options="dao_options" dense fill-input filled hide-bottom-space hide-selected input-debounce="400" label="Classe de la DAO ?" option-label="type" options-dense stack-label use-input @filter="filterDaoFn" @update:model-value="onSelectDao($event, handleChange)">
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>{{ scope.opt.type_simple }}</q-item-section>
                <q-item-section side><span class="text-caption text-grey-6">{{ scope.opt.type }}</span></q-item-section>
              </q-item>
            </template>
          </q-select>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="url" name="url" rules="required">
          <q-input v-model="form.url" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Url du webservice" stack-label v-bind="field" @update:model-value="form.url = deburr(stringcase.pathcase($event))"/>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="type de propriété @Id" name="id_type" rules="required">
          <q-input v-model="form.id_type" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Type de la propriété @Id" stack-label v-bind="field"/>
        </VeeField>

        <q-toggle v-model="form.with_page" label="Créer une page contenant la vue du référentiel"/>

        <template v-if="form.with_page">
          <VeeField #default="{errorMessage, meta, field}" label="type de propriété @Id" name="id_type" rules="required">
            <q-input v-model="form.page_name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Chemin de la page (sans extension .vue)" stack-label v-bind="field"/>
          </VeeField>

          <VeeField #default="{errorMessage, meta, field}" label="type de propriété @Id" name="id_type" rules="required">
            <q-input v-model="form.page_title" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Titre de la page" stack-label v-bind="field"/>
          </VeeField>
        </template>

        <div class="text-subtitle2">Ajouter des champs:</div>
        <q-option-group v-model="form.fields" :options="selected_entity_attributes_options!" type="checkbox">
          <template #label="{value}">
            <div class="row items-baseline q-gutter-sm">
              <div style="width: 16px">
                <q-icon v-if="value['persistent_type']" :name="value['persistent_type_data'].icon"></q-icon>
              </div>
              <div>{{ value['name'] }}</div>
              <div class="text-caption text-orange-5">{{ value['type_simple'] }}<span v-if="value['collection']">&lt{{ value['bind_type_simple'] }}&gt</span> <span v-if="value['persistent_type'] != null">(@{{ value['persistent_type_data'].assoc_name }})</span></div>
            </div>
          </template>
        </q-option-group>

        <q-btn color="primary" icon="add_circle" label="Créer le référentiel" type="submit"/>
      </template>

    </template>
  </VeeForm>
</template>

<style scoped>

</style>
