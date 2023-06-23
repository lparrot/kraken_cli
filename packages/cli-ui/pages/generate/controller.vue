<script setup lang="ts">
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";
import {convertPathToPackage} from "~/utils/java.utils";
import deburr from "lodash/deburr";
import stringcase from "stringcase";

definePageMeta({
  middleware: ['security']
})

interface Form {
  cwd: string
  name: string
  url: string
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()

const drawer = ref(false)
const form = ref<Partial<Form>>({})

async function init() {
  form.value = {
    cwd: await $api.fetchJavaRootDir($state.paths.server_java_path)
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
</script>

<template>
  <q-layout>
    <q-drawer v-model="drawer" :width="500" behavior="mobile" bordered overlay side="right">
      <div class="row items-center q-ma-sm">
        <q-space/>
        <q-btn dense flat icon="close" round @click="drawer = false"/>
      </div>
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

        <VeeField #default="{errorMessage, meta, field}" label="nom" name="name" rules="required">
          <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Nom du controller (sans suffixe)" stack-label v-bind="field" @update:model-value="form.name = deburr(stringcase.pascalcase($event))"/>
        </VeeField>

        <VeeField #default="{errorMessage, meta, field}" label="url" name="url" rules="required">
          <q-input v-model="form.url" :error="!meta.valid" :error-message="errorMessage" dense filled hide-bottom-space label="Url du webservice" stack-label v-bind="field" @update:model-value="form.url = deburr(stringcase.lowercase($event))"/>
        </VeeField>

      </template>

      <q-btn color="primary" icon="add_circle" label="Créer le controlleur" type="submit"/>
    </VeeForm>
  </q-layout>

</template>

<style scoped>

</style>
