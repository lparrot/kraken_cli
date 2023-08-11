<script lang="ts" setup>
const { show, title, description } = useAppLoader()
</script>

<template>
  <div v-show="show" class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <UIcon class="spin h-12 w-12 mb-4 text-white" name="i-mdi-dots-circle"></UIcon>
    <h2 v-if="title" class="text-center text-white text-xl font-semibold">{{ title }}</h2>
    <p v-if="description" class="w-1/3 text-center text-white">{{ description }}</p>
  </div>
</template>

<style scoped>

</style>
