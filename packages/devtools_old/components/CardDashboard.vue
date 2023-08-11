<script lang="ts" setup>
type Props = {
  item: {
    color1: string;
    color2: string;
    icon_position?: 'left' | 'right';
    icon: string;
    title: string;
    value: any;
  }
}

//@ts-ignore
const props = defineProps<Props>()

const iconPosition = computed(() => {
  return props.item?.icon_position || 'left'
})
</script>

<template>
  <q-item :class="item.color1 == null ? null : 'bg-' + item.color1" class="q-pa-none">
    <q-item-section v-if="iconPosition === 'left'" :class="item.color2 == null ? null : 'bg-' + item.color2" class="q-pa-lg q-mr-none text-white" side>
      <q-icon :name="item.icon" color="white" size="24px"></q-icon>
    </q-item-section>
    <q-item-section class=" q-pa-md q-ml-none  text-white">
      <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
      <q-item-label>{{ item.title }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="iconPosition === 'right'" class="q-mr-md text-white" side>
      <q-icon :name="item.icon" color="white" size="44px"></q-icon>
    </q-item-section>
  </q-item>
</template>

<style scoped>

</style>
