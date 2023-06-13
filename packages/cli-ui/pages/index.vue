<script setup lang="ts">
interface InfoResponse {
  success: boolean
}

const info = ref<InfoResponse>()

info.value = await useApiFetch<InfoResponse>('/api/paths')

async function openCurrentProjectFolder() {
  await useApiFetch('/api/shell/open_current_project')
}
</script>

<template>
  <q-btn color="green" label="Ouvrir le dossier du projet" @click="openCurrentProjectFolder"></q-btn>

  <q-markup-table v-if="info != null" bordered class="q-mt-md" dense flat>
    <tbody>
    <tr v-for="(value, key) in info" :key="key">
      <td>{{ key }}</td>
      <td>{{ value }}</td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>

</style>
