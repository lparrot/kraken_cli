<script setup lang="ts">
interface InfoResponse {
  success: boolean
}

const info = ref<InfoResponse>()

async function handleInit() {
  info.value = await useApiFetch<InfoResponse>('/api/paths')
}
</script>

<template>
  <q-btn color="primary" @click="handleInit">Click here</q-btn>

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
