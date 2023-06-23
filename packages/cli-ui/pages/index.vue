<script setup lang="ts">
import {useStateStore} from "~/store/state";

const $state = useStateStore()
</script>

<template>
  <div v-if="$state.paths != null">
    <q-markup-table bordered class="q-mt-md" dense flat>
      <tbody>
      <tr v-for="(value, key) in $state.paths" :key="key">
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
