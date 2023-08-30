<script lang="ts" setup>
import { convertPathToPackage } from '~/utils/java.utils'
import * as stringcase from 'stringcase'

interface FormSchema {
  cwd: string
  name: string
  url: string
}

definePageMeta({
  middleware: ['security']
})

const $state = useStateStore()
const $api = useApiStore()
const $loader = useAppLoader()
const $swal = useSwal()

const form = ref<Partial<FormSchema>>({})

const selected_package = computed(() => convertPathToPackage(form.value.cwd!))

const show = reactive({
  fileselector_cwd: false
})

function init() {
  form.value = {
    cwd: form.value.cwd
  }
}

async function submit() {
  $loader.start()

  try {
    await $api.handleGenerateController(form.value)
    init()
    await $swal.fire({
      icon: 'success',
      text: 'Controlleur créé avec succès.'
    })
  } finally {
    $loader.stop()
  }
}

init()
</script>

<template>
  <FileSelector v-model="form.cwd" v-model:show="show.fileselector_cwd" :root="$state.paths?.server_java_path"/>

  <UContainer>
    <VeeForm #default="{meta}" :initial-values="form" class="space-y-4" validate-on-mount @submit="submit">
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

        <VeeField v-model="form.name" #default="{errorMessage, field}" label="nom du controlleur" name="name" rules="required" validate-on-mount>
          <UFormGroup :error="errorMessage!" label="Nom du controlleur (sans préfixe ou suffixe)" name="name">
            <UInput :model-value="form.name" v-bind="field" @update:model-value="form.name = useDeburr(stringcase.pascalcase($event as string))"/>
          </UFormGroup>
        </VeeField>

        <VeeField v-model="form.url" #default="{errorMessage, field}" label="URL du webservice" name="url" rules="required" validate-on-mount>
          <UFormGroup :error="errorMessage!" label="URL du webservice" name="url">
            <UInput :model-value="form.url" v-bind="field" @update:model-value="form.url = useDeburr(stringcase.pathcase($event as string))"/>
          </UFormGroup>
        </VeeField>

        <UButton :disabled="!meta.valid" block type="submit">
          Créer le controlleur
        </UButton>
      </template>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
