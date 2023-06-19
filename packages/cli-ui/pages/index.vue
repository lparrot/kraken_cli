<script setup lang="ts">
import {ProjectAttributes} from "@types/kraken";

const info = ref()

const project = useState<ProjectAttributes>('project')

watch(project,
  async (newVal: ProjectAttributes) => {
    info.value = await useApiFetch('/api/paths', {
      params: {
        path: newVal.path
      }
    })
  },
  {immediate: true, deep: true})
</script>

<template>
  <div v-if="info != null">
    <q-markup-table bordered class="q-mt-md" dense flat>
      <tbody>
      <tr v-for="(value, key) in info" :key="key">
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
