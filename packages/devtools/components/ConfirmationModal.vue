<script lang="ts" setup>
const { confirming, params } = useAppConfirm()

const submitting = ref(false)

function cancelAction() {
  confirming.value = false
}

async function okAction() {
  submitting.value = true
  try {
    const result = await params.value.action()
    if (result !== false) {
      confirming.value = false
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <u-modal v-model="confirming" :ui="{ width: 'sm:max-w-sm' }">
    <u-card>
      <div class="font-semibold mb-2">{{ params.title }}</div>
      <div>{{ params.message }}</div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <u-button color="white" @click="cancelAction">Annuler</u-button>
          <u-button :loading="submitting" color="red" variant="solid" @click="okAction">{{ params.label }}</u-button>
        </div>
      </template>
    </u-card>
  </u-modal>
</template>
