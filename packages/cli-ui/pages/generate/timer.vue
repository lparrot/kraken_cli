<script setup lang="ts">
import {ResponseFsPackages} from "@types/kraken";
import {useAppStore} from "~/store/app";
import {useApiStore} from "~/store/api";
import {convertPathToPackage} from "~/utils/java.utils";
import deburr from "lodash/deburr";
import stringcase from "stringcase";

interface Form {
  name: string
  description: string
  cwd: string
}

const $q = useQuasar()
const appStore = useAppStore()
const $api = useApiStore()

const drawer = ref()
const form = ref<Partial<Form>>({})
const packages = ref<ResponseFsPackages[]>()

function init() {
  form.value = {}
}

init()

const allPackages: ResponseFsPackages[] = await useApiFetch<ResponseFsPackages[]>('/api/fs/packages', {
  query: {
    path: appStore.project.path
  }
})

packages.value = allPackages

async function submitForm() {
  $q.loading.show({message: 'Création du timer en cours ...'})

  try {
    const {cwd, ...data} = form.value
    await useApiFetch('/api/generate/timer', {
      method: 'post',
      body: {
        cwd,
        data
      }
    })
    init()
    $q.notify({
      message: 'Timer créé avec succès',
      color: 'green'
    })
  } finally {
    $q.loading.hide()
  }
}

const packageName = computed(() => {
  if (form.value.cwd == null) {
    return null
  }
  return convertPathToPackage(form.value.cwd)
})
</script>

<template>
  <q-layout>
    <q-drawer ref="drawer" behavior="mobile" bordered overlay side="right">
      <FolderFetcher v-model="form.cwd" :root="appStore.paths.server_java_path" @select="drawer.hide()"/>
    </q-drawer>

    <VeeForm #default="{isSubmitting}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
      <q-btn :color="form.cwd == null ? 'blue' : 'green'" class="full-width" no-caps @click="drawer.show()">
        <span v-if="form.cwd == null">Selectionnez un package</span>
        <span v-else>Modifier le package</span>
      </q-btn>

      <template v-if="form.cwd != null">
        <div class="row items-center q-gutter-xs">
          <q-icon color="orange" name="folder"/>
          <div class="text-subtitle2">{{ packageName }}</div>
        </div>

        <q-separator/>

        <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required">
          <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Nom du timer" stack-label v-bind="field" @update:model-value="form.name = deburr(stringcase.snakecase($event))"/>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="description" name="description" rules="required">
          <q-input v-model="form.description" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Description du timer" stack-label v-bind="field"/>
        </VeeField>

        <q-btn color="primary" icon="add_circle" label="Créer le timer" type="submit"/>
      </template>
    </VeeForm>
  </q-layout>

  {{ form }}
</template>

<style scoped>

</style>
