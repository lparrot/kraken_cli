<script lang="ts" setup>
import { NavigationItem } from '~/types'

const $state = useStateStore()

const items_to_show = computed<NavigationItem[]>(() => {
  const { menu } = useAppMenu()

  return menu.value?.map(item => {
    item.items = item.items?.filter(it => it.showIf == null || it.showIf)

    item.items?.forEach(it => {
      const itemClickFunction = it.click

      it.click = async () => {
        if (itemClickFunction != null) {
          await itemClickFunction()
        }
        $state.navigation = false
      }
    })
    return item
  })!
})
</script>

<template>
  <template v-for="item in items_to_show">
    <template v-if="item.items?.length > 0">
      <div class="py-2 text-gray-400 font-semibold">{{ item.label }}</div>
      <UVerticalNavigation :links="item.items!"/>
    </template>
  </template>
</template>

<style scoped>

</style>
