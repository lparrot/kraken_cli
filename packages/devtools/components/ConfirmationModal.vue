<script lang="ts" setup>
const {confirming, params} = useAppConfirm()

const submitting = ref(false)
const promptModel = ref<any>(params.value.prompt?.model)

function cancelAction() {
  confirming.value = false
}

const checkIsOkDisabled = computed(() => {
  if (params.value.prompt?.isValid == null) {
    return false
  }
  return !params.value.prompt.isValid(promptModel.value)
})

async function okAction() {
  submitting.value = true
  try {
    const result = await params.value.action(promptModel.value)
    if (result !== false) {
      confirming.value = false
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal v-model="confirming">
    <UCard ref="card">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="font-semibold">{{ params.title }}</div>
          <UButton class="-my-1" color="gray" icon="i-heroicons-x-mark-20-solid" variant="ghost"
                   @click="confirming = false"/>
        </div>
      </template>

      <div class="space-y-2">
        <template v-if="params.prompt != null">
          <UFormGroup :label="params.message" name="prompt">
            <UInput v-model="promptModel"/>
          </UFormGroup>
        </template>

        <div v-else>{{ params.message }}</div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton color="white" @click="cancelAction">Annuler</UButton>
          <UButton :disabled="checkIsOkDisabled" :loading="submitting" color="red" variant="solid" @click="okAction">
            {{ params.label }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
