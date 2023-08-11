<script lang="ts" setup>
const { isTabletOrMobile } = useMedia()

const $state = useStateStore()
</script>

<template>
  <header class="flex items-center justify-between gap-3 p-4 backdrop-blur border-b">
    <div class="md:flex-1 flex items-center gap-1.5">
      <div class="text-2xl text-primary-500 font-bold">DEVTOOLS</div>
    </div>

    <div v-show="isTabletOrMobile">
      <UButton icon="i-heroicons-bars-3" variant="ghost"
               @click="$state.navigation = !$state.navigation"></UButton>
    </div>
  </header>
</template>

<style scoped>

</style>
