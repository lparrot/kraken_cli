<script lang="ts" setup>
import * as stringcase from 'stringcase'

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

definePageMeta({
  middleware: ['security']
})

const validator = ref()

const $state = useStateStore()
const $api = useApiStore()
const $bus = useAppBus()
const $loader = useAppLoader()

const form = ref<Partial<Form>>({})

const readonly = ref<Partial<ReadOnlyInputs>>({})

const show = ref({
  fileselector_cwd: false
})

function init() {
  form.value = {
    group_id: 'fr.intradef.cdadr',
    node_version: $state.os_infos?.node_version!,
    socle_version: $state.os_infos?.last_npm_version!,
    db_host: '127.0.0.1',
    db_port: '3306',
    db_user: 'root',
    db_password: 'root',
    install_librairies: true,
    create_git_repo: true
  }

  readonly.value = {
    group_id: true,
    artifact_id: true,
    node_version: true,
    socle_version: true,
    db_host: true,
    db_port: true,
    db_name: true,
    db_user: true,
    db_password: true,
  }
}

async function submit() {
  $loader.start({ description: 'Création du projet en cours ...' })
  try {
    const project = await $api.handleGenerateInit(form.value)
    $bus.projects.emit()
    await $state.setProject(project?.id)
    init()
  } finally {
    $loader.stop()
  }

}

init()

watchDebounced(() => form.value.name,
  async (value) => {
    if (readonly.value.artifact_id) {
      form.value.artifact_id = stringcase.snakecase(value!)
    }

    if (readonly.value.db_name) {
      form.value.db_name = stringcase.snakecase(value!)
    }

    await nextTick(async () => {
      await validator.value.validate()
    })
  },
  { debounce: 500 }
)
</script>

<template>
  <FileSelector v-model="form.cwd" v-model:show="show.fileselector_cwd" :default-dir="$state.os_infos?.home_dir" show-home/>

  <UContainer>
    <VeeForm ref="validator" :initial-values="form" class="space-y-4" @submit="submit">
      <UButton :color="form.cwd == null ? 'blue' : 'green'" block @click="show.fileselector_cwd = true">
        <div v-if="form.cwd == null">Selectionnez un dossier</div>
        <div v-else>Modifier le dossier</div>
      </UButton>

      <template v-if="form.cwd != null">
        <div class="flex items-center gap-1.5">
          <div class="font-semibold">Dossier selectionné :</div>
          <UIcon class="text-yellow-400" name="i-ic-folder"/>
          <div>{{ form.cwd }}</div>
        </div>

        <hr/>

        <VeeField v-model="form.name" #default="{errorMessage, field}" label="nom du projet" name="name" rules="required" validate-on-mount>
          <UFormGroup :error="errorMessage!" label="Nom du projet">
            <UInput :model-value="form.name" v-bind="field"/>
          </UFormGroup>
        </VeeField>

        <template v-if="form.name != null">
          <UFormGroup label="Description du projet">
            <UInput :model-value="form.description"/>
          </UFormGroup>

          <VeeField v-model="form.group_id" #default="{errorMessage, field}" label="group ID" name="group_id" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Group ID">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.group_id!" :model-value="form.group_id" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.group_id ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.group_id = !readonly.group_id"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.artifact_id" #default="{errorMessage, field}" label="artifact ID" name="artifact_id" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Artifact ID">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.artifact_id!" :model-value="form.artifact_id" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.artifact_id ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.artifact_id = !readonly.artifact_id"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.node_version" #default="{errorMessage, field}" label="version de Node.js" name="node_version" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Version de Node.js">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.node_version!" :model-value="form.node_version" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.node_version ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.node_version = !readonly.node_version"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.socle_version" #default="{errorMessage, field}" label="version de Kraken" name="socle_version" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Version de Kraken">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.socle_version!" :model-value="form.socle_version" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.socle_version ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.socle_version = !readonly.socle_version"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.db_host" #default="{errorMessage, field}" label="ip ou hôte de la BDD" name="db_host" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Ip ou hôte de la BDD">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.db_host!" :model-value="form.db_host" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.db_host ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.db_host = !readonly.db_host"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.db_port" #default="{errorMessage, field}" label="port de la BDD" name="db_port" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Port de la BDD">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.db_port!" :model-value="form.db_port" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.db_port ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.db_port = !readonly.db_port"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.db_name" #default="{errorMessage, field}" label="nom de la BDD" name="db_name" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Nom de la BDD">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.db_name!" :model-value="form.db_name" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.db_name ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.db_name = !readonly.db_name"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.db_user" #default="{errorMessage, field}" label="utilisateur de la BDD" name="db_user" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Utilisateur de la BDD">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.db_user!" :model-value="form.db_user" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.db_user ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.db_user = !readonly.db_user"/>
              </div>
            </UFormGroup>
          </VeeField>

          <VeeField v-model="form.db_password" #default="{errorMessage, field}" label="mot de passe de la BDD" name="db_password" rules="required" validate-on-mount>
            <UFormGroup :error="errorMessage!" label="Mot de passe de la BDD">
              <div class="flex items-center gap-1.5">
                <UInput :disabled="readonly.db_password!" :model-value="form.db_password" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
                <UButton :icon="readonly.db_password ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.db_password = !readonly.db_password"/>
              </div>
            </UFormGroup>
          </VeeField>

          <UCheckbox v-model="form.install_librairies" label="Télécharger et installer les librairies Maven et NPM ?"/>

          <UCheckbox v-model="form.create_git_repo" label="Initialiser un dépôt Git ?"/>

          <UButton block type="submit">
            Créer le controlleur
          </UButton>
        </template>
      </template>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
