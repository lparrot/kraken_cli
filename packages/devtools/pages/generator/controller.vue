<script lang="ts" setup>
import { convertPathToPackage } from '~/utils/java.utils'
import { useDeburr } from '#imports'
import * as stringcase from 'stringcase'

interface FormSchema {
  cwd: string
  name: string
  url: string
}

const $state = useStateStore()
const $api = useApiStore()
const loader = useAppLoader()

const form_controller = ref<Partial<FormSchema>>({})

const selected_package = computed(() => convertPathToPackage(form_controller.value.cwd!))

const show = reactive({
  fileselector_cwd: false
})

function init() {
  form_controller.value = {}
}

async function submit() {
  loader.start({ description: 'Création du controller en cours ...' })

  try {
    await $api.handleGenerateController(form_controller.value)
  } finally {
    loader.stop()
  }
}

init()
</script>

<template>
  <FileSelector v-model="form_controller.cwd" v-model:show="show.fileselector_cwd" :root="$state.paths?.server_java_path"/>

  <UContainer>
    <VeeForm :initial-values="form_controller" class="space-y-4" validate-on-mount @submit="submit">
      <UButton :color="form_controller.cwd == null ? 'blue' : 'green'" block @click="show.fileselector_cwd = true">
        <div v-if="form_controller.cwd == null">Selectionner un package</div>
        <div v-else>Modifier le package</div>
      </UButton>

      <template v-if="form_controller.cwd != null">
        <div class="flex items-center gap-1.5">
          <div class="font-semibold">Package selectionné :</div>
          <UIcon class="text-yellow-400" name="i-ic-folder"/>
          <div>{{ selected_package }}</div>
        </div>

        <hr/>

        <VeeField #default="{errorMessage, field}" label="nom du controlleur" name="name" rules="required">
          <UFormGroup :error="errorMessage!" label="Nom du controlleur (sans préfixe ou suffixe)" name="name">
            <UInput v-model="form_controller.name" v-bind="field" @update:model-value="form_controller.name = useDeburr(stringcase.pascalcase($event as string))"/>
          </UFormGroup>
        </VeeField>

        <VeeField #default="{errorMessage, field}" label="URL du webservice" name="url" rules="required">
          <UFormGroup :error="errorMessage!" label="URL du webservice" name="url">
            <UInput v-model="form_controller.url" v-bind="field" @update:model-value="form_controller.url = useDeburr(stringcase.pathcase($event as string))"/>
          </UFormGroup>
        </VeeField>

        <UButton block type="submit">
          Créer le controlleur
        </UButton>
      </template>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
