<script lang="ts" setup>
const $state = useStateStore()
const { isTabletOrMobile } = useMedia()
</script>

<template>
  <USlideover v-if="isTabletOrMobile" v-model="$state.navigation" side="left">
    <div class="p-4 overflow-auto">
      <NavigationMenu/>
    </div>
  </USlideover>

  <main class="flex h-full overflow-hidden">
    <div v-if="!isTabletOrMobile" class="w-64 pt-4 px-2 h-full overflow-auto border-r">
      <NavigationMenu/>
    </div>

    <slot></slot>
  </main>
</template>

<style scoped>

</style>
