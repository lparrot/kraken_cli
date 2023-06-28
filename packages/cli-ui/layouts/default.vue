<script lang="ts" setup>
import {Dialog} from "quasar";
import {ProjectAttributes} from "@types/kraken";
import {useEventBus} from "@vueuse/core";
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";
import AddProject from "~/components/dialogs/AddProject.vue";

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()
const storage = useKrakenSessionStorage()
const router = useRouter()
const projectsBus = useEventBus('projects')

const drawer = ref(true)

function toggleDrawer() {
  drawer.value = !drawer.value
}

async function openSelectedProjectFolder() {
  await $api.handleOpenCurrentProjectDirectory($state.project?.path)
}

async function openSelectedProjectIdea() {
  await $api.handleOpenCurrentProjectInIntellij($state.project?.path)
}

async function deleteSelectedProject() {
  Dialog.create({
    title: 'Confirmation',
    message: 'Etes vous sûr de vouloir supprimer le projet ' + $state.project?.name + ' ?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await useApiFetch(`/api/projects/${$state.project.id}`, {
      method: 'delete'
    })
    await navigateTo('/')
    await $state.setProject(null)
    projectsBus.emit()
  })
}

async function openDialogAddProject() {
  Dialog.create({
    component: AddProject
  }).onOk(async payload => {
    await useApiFetch('/api/projects', {
      method: 'post',
      body: payload
    })

    await $state.fetchProjects()
  })
}

async function onSelectProject(param_project: ProjectAttributes) {
  storage.value.selection.project = param_project.id
  await $state.setProject(param_project.id)
  navigateTo('/')
  await $state.getOrUpdateAppData()
}

projectsBus.on(async () => await $state.fetchProjects())
</script>

<template>
  <suspense>
    <template #fallback>
      <div>Chargement ...</div>
    </template>

    <ClientOnly>
      <q-layout view="hHh Lpr lff">
        <q-header elevated>
          <q-toolbar>
            <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleDrawer"/>

            <q-toolbar-title>
              Kraken UI
            </q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" bordered show-if-above>
          <q-select :model-value="$state.project" :options="$state.projects" class="q-ma-md" dense filled label="Projet selectionné" option-label="name" options-dense stack-label @update:model-value="onSelectProject">
            <template v-slot:after>
              <q-btn color="green" dense flat icon="add_circle" round @click="openDialogAddProject">
                <q-tooltip>Ajouter un projet déjà existant</q-tooltip>
              </q-btn>
            </template>
          </q-select>

          <q-item v-if="$state.project != null" class="text-red-4" dense @click="deleteSelectedProject">
            <q-item-section>
              <q-btn-group flat spread>
                <q-btn color="orange" dense flat icon="folder" @click="openSelectedProjectFolder">
                  <q-tooltip>Ouvrir le dossier du projet</q-tooltip>
                </q-btn>
                <q-btn color="red" dense flat icon="remove_circle" @click="deleteSelectedProject">
                  <q-tooltip>Supprimer le projet de la liste (pas de suppression sur le disque)</q-tooltip>
                </q-btn>
                <q-btn color="red" dense flat @click="openSelectedProjectIdea">
                  <q-img src="/idea.png" width="2em"/>
                  <q-tooltip>Ouvrir le projet dans Intellij Idea</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>

          <q-list dense padding>
            <q-item-label header>Général</q-item-label>

            <template v-if="$state.project != null">
              <q-item dense exact to="/">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="space_dashboard"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tableau de bord</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <q-item dense exact to="/generate/init">
              <q-item-section avatar>
                <q-icon color="grey-6" name="create_new_folder"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Créer un nouveau projet</q-item-label>
              </q-item-section>
            </q-item>

            <template v-if="$state.project != null">

              <q-separator spaced/>

              <q-item-label header>Génération côté serveur</q-item-label>

              <q-item dense exact to="/generate/controller">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="api"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Controlleur</q-item-label>
                </q-item-section>
                <q-tooltip anchor="center right" self="center start">Génération d'un controlleur Rest et son service associé</q-tooltip>
              </q-item>

              <q-item dense exact to="/generate/ref">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="view_list"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Referentiel</q-item-label>
                </q-item-section>
                <q-tooltip anchor="center right" self="center start">Permet de créer les classes de type referentiel</q-tooltip>
              </q-item>

              <q-item dense exact to="/generate/timer">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="schedule"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Timer</q-item-label>
                </q-item-section>
                <q-tooltip anchor="center right" self="center start">Crée une classe de timer et le script SQL associé</q-tooltip>
              </q-item>

              <q-separator spaced/>

              <q-item-label header>Génération côté web</q-item-label>

              <q-item dense exact to="/generate/page">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="article"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Page</q-item-label>
                  <q-tooltip anchor="center right" self="center start">Génération d'une page .vue</q-tooltip>
                </q-item-section>
              </q-item>

              <q-item dense exact to="/generate/store">
                <q-item-section avatar>
                  <q-icon color="grey-6" name="save"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Store</q-item-label>
                  <q-tooltip anchor="center right" self="center start">Génération d'un store Nuxt</q-tooltip>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-drawer>

        <q-page-container>
          <q-page padding>
            <nuxt-page/>
          </q-page>
        </q-page-container>
      </q-layout>
    </ClientOnly>
  </suspense>
</template>

<style scoped>

</style>
