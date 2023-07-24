<script lang="ts" setup>
import {scroll, useDialogPluginComponent} from "quasar";
import {useApiStore} from "~/store/api";
import {useStateStore} from "~/store/state";
import getScrollTarget = scroll.getScrollTarget;
import setVerticalScrollPosition = scroll.setVerticalScrollPosition;

defineEmits([
  ...useDialogPluginComponent.emits
])

const {$io} = useNuxtApp()

const {dialogRef, onDialogHide} = useDialogPluginComponent()

const $api = useApiStore()
const $state = useStateStore()

const divEnd = ref(null)

onMounted(async () => {
  await $state.fetchLogs()
  scrollToElement(divEnd.value)
})

$io.on('log:message', async () => {
  await $state.fetchLogs()
  scrollToElement(divEnd.value)
})

function scrollToElement(el) {
  if (el == null) {
    return
  }
  const target = getScrollTarget(el)
  const offset = el.offsetTop
  const duration = 1000
  setVerticalScrollPosition(target, offset, duration)
}

onBeforeUnmount(() => {
  $io.off('log:message')
})
</script>

<template>
  <q-dialog ref="dialogRef" full-width @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-bar>
        <q-space/>
        <q-btn v-close-popup dense flat icon="close"/>
      </q-bar>

      <q-card-section class="scroll" style="height: 80vh">
        <div v-for="log in $state.logs" v-html="log"></div>
        <div ref="divEnd"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
