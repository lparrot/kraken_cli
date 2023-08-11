<script lang="ts" setup>
interface Props {
  title: string
  description: string
  icon: string
  iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: 'bg-green-500'
})
</script>

<template>
  <div class="w-full flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 border">
    <div class="flex-auto p-4">
      <div class="flex flex-wrap">
        <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">{{ title }}</h5>
          <span class="font-semibold text-xl text-gray-700">{{ description }}</span>
        </div>
        <div class="relative w-auto pl-4 flex-initial">
          <div :class="iconClass" class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full">
            <UIcon :name="icon" class="text-2xl"></UIcon>
          </div>
        </div>
      </div>
      <div class="text-sm mt-4">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
