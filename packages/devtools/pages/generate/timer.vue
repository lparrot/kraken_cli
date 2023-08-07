<script setup lang="ts">
import { ResponseFsPackages } from '@kraken/types'
import { useStateStore } from '~/store/state'
import { useApiStore } from '~/store/api'
import { convertPathToPackage } from '~/utils/java.utils'
import deburr from 'lodash/deburr'
import stringcase from 'stringcase'

definePageMeta({
  middleware: ['security']
})

interface Form {
  name: string
  description: string
  cwd: string
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()

const drawer = ref(false)
const form = ref<Partial<Form>>({})
const packages = ref<ResponseFsPackages[]>()

async function init() {
  form.value = {
    cwd: await $api.fetchJavaRootDir($state.paths.server_java_path)
  }
}

await init()

const allPackages: ResponseFsPackages[] = await useApiFetch<ResponseFsPackages[]>('/api/fs/packages', {
  query: {
    path: $state.project.path
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
    await $api.handleProjectApiRestartJavaApplication()
    await init()
    $q.notify({
      message: 'Timer créé avec succès',
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
</script>

<template>
  <q-drawer v-model="drawer" :width="500" behavior="mobile" overlay side="right">
    <FileFetcher v-model="form.cwd" :root="$state.paths.server_java_path"/>
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

      <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required">
        <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Nom du timer" stack-label v-bind="field" @update:model-value="form.name = deburr(stringcase.snakecase($event))"/>
      </VeeField>

      <VeeField #default="{errorMessage, meta, field}" label="description" name="description" rules="required">
        <q-input v-model="form.description" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Description du timer" stack-label v-bind="field"/>
      </VeeField>

      <q-btn color="primary" icon="add_circle" label="Créer le timer" type="submit"/>
    </template>
  </VeeForm>
</template>

<style scoped>

</style>
