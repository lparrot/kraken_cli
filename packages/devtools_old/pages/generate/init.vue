<script lang="ts" setup>
import {Loading, QInput} from 'quasar'
import stringcase from 'stringcase'
import {useEventBus} from '@vueuse/core'
import {useStateStore} from '~/store/state'
import {FormContext} from "vee-validate";
import {validateFields} from "~/utils/vue.utils";

interface Form {
  cwd?: string
  folder?: string
  name?: string | null
  description?: string
  group_id: string
  artifact_id?: string
  node_version: string
  socle_version: string
  db_host: string
  db_port: string
  db_name?: string
  db_user: string
  db_password: string
  install_librairies?: boolean
  create_git_repo?: boolean
}

interface ReadOnlyInputs {
  group_id: boolean
  artifact_id: boolean
  node_version: boolean
  socle_version: boolean
  db_host: boolean
  db_port: boolean
  db_name: boolean
  db_user: boolean
  db_password: boolean
}

const $state = useStateStore()
const projectsBus = useEventBus('projects')

const drawer = ref()
const validator = ref<FormContext>()
const form = ref<Partial<Form>>({})
const readonly_inputs = ref<Partial<ReadOnlyInputs>>({})

function init() {
  form.value = {
    group_id: 'fr.intradef.cdadr',
    node_version: $state.infos?.node_version!,
    socle_version: $state.infos?.last_npm_version!,
    db_host: '127.0.0.1',
    db_port: '3306',
    db_user: 'root',
    db_password: 'root',
    install_librairies: true,
    create_git_repo: true
  }

  readonly_inputs.value = {
    group_id: true,
    artifact_id: true,
    node_version: true,
    socle_version: true,
    db_host: true,
    db_port: true,
    db_name: true,
    db_user: true,
    db_password: true
  }
}

init()

async function submitForm(values: any, validator: any) {
  Loading.show({message: 'Création du projet en cours'})
  try {
    const project = await useApiFetch<any>('/api/generate/init', {
      method: 'post',
      body: {
        ...form.value,
        with_create: true
      }
    })
    await $state.setProject(project?.id)
    init()
    projectsBus.emit()
  } finally {
    Loading.hide()
  }
}

watch(
    () => form.value?.name,
    async (newVal) => {
      if (readonly_inputs.value?.artifact_id) {
        form.value.artifact_id = stringcase.snakecase(newVal!)
      }
      if (readonly_inputs.value?.db_name) {
        form.value.db_name = stringcase.snakecase(newVal!)
      }

      await validateFields(validator.value!, ['artifact_id', 'db_name'])
    }
)
</script>

<template>
  <q-drawer v-model="drawer" :width="500" behavior="mobile" overlay side="right">
    <FileFetcher v-model="form.cwd" :default-dir="$state.infos?.home_dir" show-home/>
  </q-drawer>

  <VeeForm ref="validator" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
    <q-btn :color="form.cwd == null ? 'blue' : 'green'" class="full-width" no-caps @click="drawer = true">
      <span v-if="form.cwd == null">Selectionnez un dossier</span>
      <span v-else>Modifier le dossier</span>
    </q-btn>

    <template v-if="form.cwd != null">
      <div>
        <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required">
          <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space
                   label="Nom du projet" stack-label v-bind="field"/>
        </VeeField>

        <div class="text-grey-7 q-field__bottom">{{ form.cwd }}\ <span class="text-weight-bolder">{{
            form.artifact_id
          }}</span></div>
      </div>

      <template v-if="form.name != null">

        <q-input v-model="form.description" dense filled hide-bottom-space label="Description du projet" stack-label/>

        <VeeField #default="{errorMessage, meta, field}" label="group ID" name="group_id" rules="required">
          <q-input v-model="form.group_id" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.group_id" dense filled hide-bottom-space label="Group ID" stack-label
                   v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.group_id" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.group_id = !readonly_inputs.group_id"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="artifact ID" name="artifact_id" rules="required">
          <q-input v-model="form.artifact_id" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.artifact_id" dense filled hide-bottom-space label="Artfifact ID"
                   stack-label v-bind="field"
                   @update:model-value="form.artifact_id = stringcase.snakecase($event as string)">
            <template #append>
              <q-btn v-if="readonly_inputs.artifact_id" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.artifact_id = !readonly_inputs.artifact_id"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="version de Node.js" name="node_version"
                  rules="required">
          <q-input v-model="form.node_version" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.node_version" dense filled hide-bottom-space label="Version de Node.js"
                   stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.node_version" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.node_version = !readonly_inputs.node_version"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="version de Kraken" name="socle_version"
                  rules="required">
          <q-input v-model="form.socle_version" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.socle_version" dense filled hide-bottom-space label="Version de Kraken"
                   stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.socle_version" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.socle_version = !readonly_inputs.socle_version"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="ip ou hôte de la BDD" name="db_host" rules="required">
          <q-input v-model="form.db_host" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.db_host" dense filled hide-bottom-space
                   label="IP ou nom d'hôte de la BDD de dev" stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.db_host" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.db_host = !readonly_inputs.db_host"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="port de la BDD" name="db_port" rules="required">
          <q-input v-model="form.db_port" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.db_port" dense filled hide-bottom-space
                   label="Port utilisé par la BDD de dev" stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.db_port" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.db_port = !readonly_inputs.db_port"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="nom de la BDD" name="db_name" rules="required">
          <q-input v-model="form.db_name" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.db_name" dense filled hide-bottom-space label="Nom de la BDD de dev"
                   stack-label v-bind="field"
                   @update:model-value="form.db_name = stringcase.snakecase($event as string)">
            <template #append>
              <q-btn v-if="readonly_inputs.db_name" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.db_name = !readonly_inputs.db_name"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="utilisateur de la BDD" name="db_user" rules="required">
          <q-input v-model="form.db_user" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.db_user" dense filled hide-bottom-space label="Utilisateur la BDD de dev"
                   stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.db_user" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.db_user = !readonly_inputs.db_user"/>
            </template>
          </q-input>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="mot de passe de la BDD" name="db_password"
                  rules="required">
          <q-input v-model="form.db_password" :error="!meta.valid" :error-message="errorMessage"
                   :readonly="readonly_inputs.db_password" dense filled hide-bottom-space
                   label="Mot de passe de la BDD de dev" stack-label v-bind="field">
            <template #append>
              <q-btn v-if="readonly_inputs.db_password" dense flat icon="edit" round tabindex="-1"
                     @click="readonly_inputs.db_password = !readonly_inputs.db_password"/>
            </template>
          </q-input>
        </VeeField>

        <div>
          <q-toggle v-model="form.install_librairies" dense
                    label="Télécharger et installer les librairies Maven et NPM ?"/>
        </div>

        <div>
          <q-toggle v-model="form.create_git_repo" dense label="Initialiser un dépôt Git ?"/>
        </div>

        <q-btn color="green" icon="settings" label="Créer le projet" type="submit"/>
      </template>
    </template>
  </VeeForm>
</template>

<style scoped>

</style>
