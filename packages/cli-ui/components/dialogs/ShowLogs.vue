<script lang="ts" setup>
import {scroll, useDialogPluginComponent} from "quasar";
import {useApiStore} from "~/store/api";
import getScrollTarget = scroll.getScrollTarget;
import setVerticalScrollPosition = scroll.setVerticalScrollPosition;

defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps<{ logs?: string[] }>()

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const $api = useApiStore()

const divEnd = ref(null)

onMounted(() => {
  scrollToElement(divEnd.value)
})

function scrollToElement(el) {
  console.log(el)
  if (el == null) {
    return
  }
  const target = getScrollTarget(el)
  const offset = el.offsetTop
  const duration = 1000
  setVerticalScrollPosition(target, offset, duration)
}
</script>

<template>
  <q-dialog ref="dialogRef" full-width @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-bar>
        <q-space/>
        <q-btn v-close-popup dense flat icon="close"/>
      </q-bar>

      <q-card-section class="scroll" style="max-height: 80vh">
        <div v-for="log in props.logs">{{ log }}</div>
        <div ref="divEnd"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
