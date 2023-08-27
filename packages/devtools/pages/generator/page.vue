<script lang="ts" setup>
import deburr from 'lodash/deburr'
import stringcase from 'stringcase'
import { FormContext } from 'vee-validate'
import kebabCase from 'lodash/kebabCase'

interface Form {
  cwd: string
  name: string
  title: string
}

interface ReadOnlyInputs {
  title: boolean
}

definePageMeta({
  middleware: ['security']
})

const $state = useStateStore()
const $api = useApiStore()
const $loader = useAppLoader()
const $toast = useToast()

const form = ref<Partial<Form>>({})
const readonly = ref<Partial<ReadOnlyInputs>>({})
const show = ref({})
const form_validator = ref<FormContext>()

function init() {
  form.value = {
    cwd: $state.project?.path,
  }
  readonly.value = {
    title: true,
  }
}

async function submit() {
  $loader.start()
  try {
    await $api.handleGeneratePage(form.value)
    init()
    $toast.add({ description: 'Création de la page effectuée avec succès.' })
  } finally {
    $loader.stop()
  }
}

async function onModelValueName(modelValue) {
  form.value.name = deburr(stringcase.pathcase(modelValue))
  form.value.title = stringcase.sentencecase(kebabCase(modelValue))
  await validateFields(form_validator.value, ['title'])
}

init()
</script>

<template>
  <UContainer>
    <VeeForm ref="form_validator" #default="{meta}" :initial-values="form" class="space-y-4" validate-on-mount @submit="submit">
      <VeeField v-model="form.name" #default="{errorMessage, field}" label="nom du fichier" name="name" rules="required" validate-on-mount>
        <UFormGroup :error="errorMessage!" label="Nom du fichier (sans l'extension .vue)">
          <UInput :model-value="form.name" v-bind="field" @update:model-value="onModelValueName"/>
        </UFormGroup>
      </VeeField>

      <VeeField v-model="form.title" #default="{errorMessage, field}" label="titre de la page" name="title" rules="required" validate-on-mount>
        <UFormGroup :error="errorMessage!" label="Titre de la page">
          <div class="flex items-center gap-1.5">
            <UInput :disabled="readonly.title!" :model-value="form.title" :ui="{wrapper: 'w-full relative'}" v-bind="field"/>
            <UButton :icon="readonly.title ? 'i-mdi-pencil' : 'i-mdi-lock'" color="blue" @click="readonly.title = !readonly.title"/>
          </div>
        </UFormGroup>
      </VeeField>

      <UButton :disabled="!meta.valid" block type="submit">
        Créer la page
      </UButton>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
