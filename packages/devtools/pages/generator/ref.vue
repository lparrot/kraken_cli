<script lang="ts" setup>
import sortBy from 'lodash/sortBy'
import {ProjectAppDataAttribute, ProjectAppDataDao, ProjectAppDataEntity} from '@kraken/types'
import stringcase, {sentencecase, snakecase} from 'stringcase'
import pluralize from 'pluralize'
import {convertPathToPackage} from '~/utils/java.utils'
import deburr from 'lodash/deburr'

interface Form {
  cwd: string
  dao: ProjectAppDataDao
  entity: ProjectAppDataEntity
  id_type: string
  template: string
  url: string
  fields: ProjectAppDataAttribute[],
  with_page: boolean
  page_name?: string
  page_title?: string
}

definePageMeta({
  middleware: ['security']
})

const $api = useApiStore()
const $state = useStateStore()
const $loader = useAppLoader()
const $swal = useSwal()

const templateOptions = [{label: 'Consultation', value: 'simple'}, {label: 'Consultation/Modification', value: 'crud'}]

let entity_files: any[]
let dao_files: any[]

if ($state.appdata?.entities != null) {
  entity_files = $state.appdata.entities
  dao_files = $state.appdata.entities.map(entity => entity.dao)
} else {
  entity_files = sortBy((await $api.fetchFsFilesJava($state.paths?.server_java_path!)).map(path => ({value: path, label: convertPathToPackage(path)})), 'label')
  dao_files = entity_files
}

const form = ref<Partial<Form>>({})

const show = ref({
  fileselector_cwd: false
})

const defaultSelectedPackage = await $api.fetchProjectJavaRootDir()

const selected_package = computed(() => convertPathToPackage(form.value.cwd!))

const selected_template = computed(() => {
  return templateOptions.find(it => it.value === form.value.template)
})

const selected_entity_attributes_options = computed(() => sortBy(form.value.entity?.attributes?.filter(it => it.id == null).map(att => ({...att, persistent_type_data: getPersistentTypeData(att?.persistent_type!)})), [o => o.persistent_type != null]))

function init() {
  form.value = {
    cwd: form.value.cwd,
    template: 'simple',
    url: '/api/referentiels/',
    id_type: 'Long',
    fields: [],
    with_page: true
  }
}

function onSelectEntity(entity: ProjectAppDataEntity) {
  form.value!!.dao = entity?.dao
  form.value!!.url = `/api/referentiels/${pluralize(snakecase(entity.name))}`
  form.value!!.id_type = entity.attributes!.find(it => it.id === true)?.type!
  form.value!!.page_name = `referentiels/${pluralize(snakecase(entity.name))}`
  form.value!!.page_title = `Référentiel des ${pluralize(sentencecase(entity.name).toLowerCase())}`
}

async function submit() {
  const {dao, entity, ...data} = form.value

  try {
    $loader.start({description: 'Création du référentiel en cours'})
    await $api.handleGenerateReferentiel({...data, entity_name: entity?.file_path, dao_name: dao?.file_path})

    await $api.handleProjectCompile()
    init()
    await $swal.fire({
      icon: 'success',
      text: 'Référentiel créé avec succès.'
    })
  } finally {
    $loader.stop()
  }
}

init()
</script>

<template>
  <FileSelector v-model="form.cwd" v-model:show="show.fileselector_cwd" :default-dir="defaultSelectedPackage"
                :root="$state.paths?.server_java_path"/>

  <UContainer>
    <VeeForm :initial-values="form" class="space-y-4" validate-on-mount @submit="submit">
      <UButton :color="form.cwd == null ? 'blue' : 'green'" block @click="show.fileselector_cwd = true">
        <div v-if="form.cwd == null">Selectionner un package</div>
        <div v-else>Modifier le package</div>
      </UButton>

      <template v-if="form.cwd != null">
        <div class="flex items-center gap-1.5">
          <div class="font-semibold">Package selectionné :</div>
          <UIcon class="text-yellow-400" name="i-ic-folder"/>
          <div>{{ selected_package }}</div>
        </div>

        <hr/>

        <USelectMenu v-model="form.template" :options="templateOptions" option-attribute="label"
                     value-attribute="value">
          <template #label>
            <span>{{ selected_template?.label }}</span>
          </template>
        </USelectMenu>

        <template v-if="form.template != null">
          <VeeField v-model="form.entity" #default="{errorMessage, field}" label="classe de l'entité" name="entity"
                    rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage" label="Classe de l'entité">
              <USelectMenu :model-value="form.entity" :options="entity_files" :search-attributes="['name', 'type']"
                           searchable
                           searchable-placeholder="Rechercher..."
                           v-bind="field" @update:model-value="onSelectEntity">
                <template #label>
                  <div v-if="form.entity == null">Aucun élément selectionné</div>
                  <div v-else class="flex w-full items-center justify-between">
                    <div>{{ form.entity?.name }}</div>
                    <div class="text-xs text-gray-500">{{ form.entity?.type }}</div>
                  </div>
                </template>

                <template #option="{option}">
                  <div class="flex w-full items-center justify-between">
                    <div>{{ option.name }}</div>
                    <div class="text-xs text-gray-500">{{ option.type }}</div>
                  </div>
                </template>
              </USelectMenu>
            </UFormGroup>
          </VeeField>

          <template v-if="form.entity">
            <VeeField v-model="form.dao" #default="{errorMessage, field}" label="dao liée à l'entité" name="dao"
                      rules="required" validate-on-mount>
              <UFormGroup :error="errorMessage" label="Dao liée à l'entité">
                <USelectMenu :model-value="form.dao" :options="dao_files" :search-attributes="['name', 'type']"
                             searchable
                             searchable-placeholder="Rechercher..."
                             v-bind="field">
                  <template #label>
                    <div v-if="form.dao == null">Aucun élément selectionné</div>
                    <div v-else class="flex w-full items-center justify-between">
                      <div>{{ form.dao?.name }}</div>
                      <div class="text-xs text-gray-500">{{ form.dao?.type }}</div>
                    </div>
                  </template>

                  <template #option="{option}">
                    <div class="flex w-full items-center justify-between">
                      <div>{{ option.name }}</div>
                      <div class="text-xs text-gray-500">{{ option.type }}</div>
                    </div>
                  </template>
                </USelectMenu>
              </UFormGroup>
            </VeeField>

            <VeeField v-model="form.url" #default="{errorMessage, field}" label="url" name="url" rules="required">
              <UFormGroup :error="errorMessage" label="Url du webservice">
                <UInput :model-value="form.url" v-bind="field"
                        @update:model-value="form.url = deburr(stringcase.pathcase($event))"/>
              </UFormGroup>
            </VeeField>

            <VeeField v-model="form.id_type" #default="{errorMessage, field}" label="type de propriété @Id"
                      name="id_type" rules="required">
              <UFormGroup :error="errorMessage" label="Type de la propriété @Id">
                <UInput :model-value="form.id_type" v-bind="field"/>
              </UFormGroup>
            </VeeField>

            <div class="flex items-center gap-1.5">
              <UToggle id="with_page" v-model="form.with_page"/>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200" for="with_page">Créer une page
                contenant
                la vue
                du référentiel</label>
            </div>

            <template v-if="form.with_page">
              <UCard>
                <VeeField v-model="form.page_name" #default="{errorMessage, field}" label="chemin de la page"
                          name="page_name"
                          rules="required">
                  <UFormGroup :error="errorMessage" label="Chemin de la page (sans extension .vue)">
                    <UInput :model-value="form.page_name" v-bind="field"/>
                  </UFormGroup>
                </VeeField>

                <VeeField v-model="form.page_title" #default="{errorMessage, field}" label="titre de la pag"
                          name="page_title"
                          rules="required">
                  <UFormGroup :error="errorMessage" label="Titre de la page">
                    <UInput :model-value="form.page_title" v-bind="field"/>
                  </UFormGroup>
                </VeeField>
              </UCard>
            </template>

            <UCard>
              <div class="text-gray-600 font-semibold underline">Ajouter des champs:</div>

              <template v-for="(attribute, attributeIndex) in selected_entity_attributes_options">
                <div class="flex items-baseline gap-1.5 space-y-1">
                  <UCheckbox :id="`attribute-${attributeIndex}`" v-model="form.fields"
                             :value="attribute"></UCheckbox>
                  <label :for="`attribute-${attributeIndex}`" class="flex items-end gap-1.5">
                    <span class="w-[16px]">
                      <UIcon v-if="attribute.persistent_type != null"
                             :name="attribute.persistent_type_data!!.icon"></UIcon>
                    </span>
                    <span>{{ attribute.name }}</span>
                    <span class="text-sm font-thin text-orange-500">
                      <span>{{ attribute.type_simple }}</span>
                      <span v-if="attribute.collection">&lt {{ attribute.bind_type_simple }} &gt</span>
                      <span v-if="attribute.persistent_type != null">(@{{ attribute.persistent_type_data!!.assoc_name }})</span>
                  </span>
                  </label>
                </div>
              </template>
            </UCard>

            <UButton block type="submit">
              Créer le référentiel
            </UButton>
          </template>
        </template>

      </template>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
