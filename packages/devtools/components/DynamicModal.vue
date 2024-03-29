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
    const result = await params.value?.action!(promptModel.value)
    if (result !== false) {
      confirming.value = false
    }
    promptModel.value = null
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport v-if="confirming" :to="params.attachTo">
    <UModal v-model="confirming">
      <VeeForm @submit="okAction">
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
                <UInput v-model="promptModel" autofocus/>
              </UFormGroup>
            </template>

            <div v-else>{{ params.message }}</div>
          </div>

          <template #footer>
            <div class="flex justify-end space-x-2">
              <UButton :color="params.buttons?.cancel?.color" @click="cancelAction">Annuler</UButton>
              <UButton :color="params.buttons?.ok?.color" :disabled="checkIsOkDisabled" :loading="submitting"
                       type="submit" variant="solid">
                {{ params.label }}
              </UButton>
            </div>
          </template>
        </UCard>
      </VeeForm>
    </UModal>
  </Teleport>
</template>
