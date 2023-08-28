<script lang="ts" setup>
import {convertPathToPackage} from '~/utils/java.utils'

interface Form {
  cwd: string
}

definePageMeta({
  middleware: ['security']
})

const $state = useStateStore()
const $api = useApiStore()
const $loader = useAppLoader()

const form = ref<Partial<Form>>({})
const show = ref({
  fileselector_cwd: false
})

const selected_package = computed(() => convertPathToPackage(form.value.cwd!))

function init() {
  form.value = {}
}

async function submit() {
  $loader.start()
  try {

  } finally {
    $loader.stop()
  }
}

init()
</script>

<template>
  <FileSelector v-model="form.cwd" v-model:show="show.fileselector_cwd" :root="$state.paths?.server_java_path"/>

  <UContainer>
    <VeeForm #default="{meta}" :initial-values="form" class="space-y-4" validate-on-mount @submit="submit">
      <UButton :color="form.cwd == null ? 'blue' : 'green'" block @click="show.fileselector_cwd = true">
        <div v-if="form.cwd == null">Selectionner un package</div>
        <div v-else>Modifier le package</div>
      </UButton>

      <template v-if="form.cwd != null">
        <div class="flex items-center gap-1.5">
          <div class="font-semibold">Package selectionné :</div>
          <UIcon class="text-yellow-400" name="i-ic-folder"/>
          <div>{{ selected_package }}</div>
        </div>

        <hr/>

        <UButton :disabled="!meta.valid" block type="submit">
          Créer
        </UButton>
      </template>

    </VeeForm>
  </UContainer>
</template>

<style scoped>

</style>
