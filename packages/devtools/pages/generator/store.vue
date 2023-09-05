<script lang="ts" setup>
interface Form {
  name: string
}

definePageMeta({
  middleware: ['security']
})

const $state = useStateStore()
const $api = useApiStore()
const $loader = useAppLoader()
const $swal = useSwal()

const form = ref<Partial<Form>>({})

function init() {
  form.value = {
    name: ''
  }
}

async function submit() {
  $loader.start()
  try {

    init()
    await $swal.fire({
      icon: 'success',
      text: 'Création du store effectué avec succès.'
    })
  } finally {
    $loader.stop()
  }
}
</script>

<template>
  <UContainer>
    <VeeForm ref="form_validator" #default="{meta}" :initial-values="form" class="space-y-4" validate-on-mount @submit="submit">
      <VeeField v-model="form.name" #default="{errorMessage, field}" label="nom du fichier" name="name" rules="required" validate-on-mount>
        <UFormGroup :error="errorMessage!" label="Nom du fichier du store (sans extension)">
          <UInput :model-value="form.name" v-bind="field"/>
        </UFormGroup>
      </VeeField>

      <UButton :disabled="!meta.valid" block type="submit">
        Créer le store
      </UButton>
    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
