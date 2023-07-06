<script lang="ts" setup>
import {useApiStore} from "~/store/api";
import {useStateStore} from "~/store/state";
import {useDialogPluginComponent} from "quasar";
import {sentencecase} from "stringcase";
import {trim} from "lodash";

const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()

const {data} = defineProps<{
  data: any
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const code_content = computed(() => {
  const url = `/${trim(data.page_name, '/\\')}`
  const title = sentencecase(data.page_title)
  return `new MenuItem({ label: '${title}', url: '${url}', access: [] }),`
})
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 75vw">
      <q-card-section>
        <div class="text-subtitle2">Copier ce code dans le fichier <code class="text-italic text-blue-5">kraken.config.js</code> (ou tout autre fichier qui vous sert de configuration du menu du socle) au niveau de l'attribut menu de la configuration.</div>
        <div class="row items-end q-gutter-sm text-orange-5">
          <q-icon name="warning" size="sm"></q-icon>
          <div>N'oubliez pas de relancer votre serveur afin que les modifications côté serveur soient prises en compte.</div>
        </div>
        <Highlight :content="code_content" lang="javascript"/>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Fermer" @click="onDialogOK"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
