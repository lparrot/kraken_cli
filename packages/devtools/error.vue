<template>
  <NuxtLayout name="default">
    <div class="text-h5">Oops ! une erreur est survenue😱</div>

    <div class="text-weight-bold">Message: {{ error.message }}</div>
    <br>
    <q-btn color="primary" @click="handleError">Fermer</q-btn>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const props = defineProps<{
  error: Error
}>()

const handleError = () => clearError({redirect: '/'})
</script>
