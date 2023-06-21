<script setup lang="ts">
import {useAppStore} from "~/store/app";

interface Form {
  name: string
  title: string
}

const $q = useQuasar()
const appStore = useAppStore()

const form = ref<Partial<Form>>()

function init() {
  form.value = {}
}

init()

async function submitForm() {
  $q.loading.show({message: 'Création du référentiel en cours ...'})

  try {

    init()
  } finally {
    $q.loading.hide()
  }
}
</script>

<template>

</template>

<style scoped>

</style>
