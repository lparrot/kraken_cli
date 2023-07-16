<script setup lang="ts">
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";
import {Loading} from "quasar";
import CardDashboard from "~/components/CardDashboard.vue";
import {ThreadMessage} from "@kraken/types";

const $state = useStateStore()
const $api = useApiStore()
const {$io} = useNuxtApp()

async function generateAppData() {
  Loading.show({message: 'Génération du fichier appdata'})
  try {
    $state.appdata = await $api.handleRefreshAppData()
  } finally {
    Loading.hide()
  }
}

async function runJavaApplication() {
  await $api.handleRunJavaApplication($state.project?.path)
}

$io.on('thread', (message: ThreadMessage) => {
  console.log(message)
})
</script>

<template>
  <template v-if="$state.project != null">
    <div class="column items-stretch q-col-gutter-sm">
      <div class="row q-gutter-sm">
        <q-btn color="blue" size="sm" @click="generateAppData">Regénérer fichier appdata</q-btn>
        <q-btn color="blue" size="sm" @click="runJavaApplication">Démarrer l'application Java</q-btn>
      </div>

      <div v-if="$state.appdata != null" class="row q-col-gutter-sm">
        <div v-if="$state.appdata.socle_version" class="col">
          <card-dashboard :item="{title: 'Version du socle', icon: 'mdi-numeric', value: $state.appdata?.socle_version, color1: 'deep-purple-5', color2: 'deep-purple-7' }"/>
        </div>
        <div class="col">
          <card-dashboard :item="{title: 'Entités', icon: 'mdi-database', value: $state.appdata?.entities.length, color1: 'orange-5', color2: 'orange-7' }"/>
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col">
          <q-card v-if="$state.paths != null">
            <q-card-section>
              <div class="text-h6">Liste des chemins du projet</div>
            </q-card-section>

            <q-card-section>
              <q-markup-table class="q-mt-md" dense flat>
                <tbody>
                <tr v-for="(value, key) in $state.paths" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

  </template>

  <div v-else>Aucun projet selectionné. Veuillez selectionner un projet dans la liste, importez en un ou créez en un nouveau.</div>
</template>

<style scoped>

</style>
