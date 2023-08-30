<script lang="ts" setup>
import { convertPathToPackage } from '~/utils/java.utils'
import * as stringcase from 'stringcase'

interface Form {
  cwd: string
  name: string
  description: string
}

definePageMeta({
  middleware: ['security']
})

const $state = useStateStore()
const $api = useApiStore()
const $loader = useAppLoader()
const $swal = useSwal()

const form = ref<Partial<Form>>({})
const show = ref({
  fileselector_cwd: false
})

const selected_package = computed(() => convertPathToPackage(form.value.cwd!))

function init() {
  form.value = {
    cwd: form.value.cwd
  }
}

async function submit() {
  $loader.start()
  try {
    await $api.handleGenerateTimer(form.value)
    init()
    await $swal.fire({
      icon: 'success',
      text: 'Timer créé avec succès.'
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

        <VeeField v-model="form.name" #default="{errorMessage, field}" label="nom" name="name" rules="required" validate-on-mount>
          <UFormGroup :error="errorMessage!" label="Nom" name="name">
            <UInput :model-value="form.name" v-bind="field" @update:model-value="form.name = useDeburr(stringcase.pascalcase($event as string))"/>
          </UFormGroup>
        </VeeField>

        <VeeField v-model="form.description" #default="{errorMessage, field}" label="description" name="description" rules="required" validate-on-mount>
          <UFormGroup :error="errorMessage!" label="Description" name="description">
            <UInput :model-value="form.description" v-bind="field"/>
          </UFormGroup>
        </VeeField>

        <UButton :disabled="!meta.valid" block type="submit">
          Créer le timer
        </UButton>
      </template>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
