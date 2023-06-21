<script setup lang="ts">
import {useAppStore} from "~/store/app";

const info = ref()

const appStore = useAppStore()
</script>

<template>
  <div v-if="appStore.paths != null">
    <q-markup-table bordered class="q-mt-md" dense flat>
      <tbody>
      <tr v-for="(value, key) in appStore.paths" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </div>

  <div v-else>Aucun projet selectionné. Veuillez selectionner un projet dans la liste, importez en un ou créez en un nouveau.</div>
</template>

<style scoped>

</style>
