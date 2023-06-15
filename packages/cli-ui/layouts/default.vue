<script lang="ts" setup>
import {Ref} from "vue";
import {Dialog} from "quasar";
import {AddProject} from "#components";
import {ProjectAttributes} from "@types/kraken";

const storage = useKrakenSessionStorage()
const router = useRouter()

const drawer = ref(true)
const project = useState<ProjectAttributes>('project')
const projects: Ref<ProjectAttributes[]> = useState('projects')

if (storage.value.selection.project != null) {
  project.value = await useApiFetch(`/api/projects/${storage.value.selection.project}`)
}

function toggleDrawer() {
  drawer.value = !drawer.value
}

async function getProjects() {
  projects.value = await useApiFetch('/api/projects')
}

async function openDialogAddProject() {
  Dialog.create({
    component: AddProject
  }).onOk(async payload => {
    projects.value = await useApiFetch('/api/projects', {
      method: 'post',
      body: payload
    })
  })
}

async function onSelectProject(param_project: ProjectAttributes) {
  storage.value.selection.project = param_project.id
  project.value = param_project
  router.push('/')
}

await getProjects()
</script>

<template>
  <suspense>
    <template #fallback>
      <div>Chargement ...</div>
    </template>

    <ClientOnly>
      <q-layout view="lHh Lpr lFf">
        <q-header elevated>
          <q-toolbar>
            <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleDrawer"/>

            <q-toolbar-title>
              Kraken UI
            </q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" bordered show-if-above>
          <q-select :model-value="project" :options="projects" class="q-ma-md" dense filled label="Projet selectionné" option-label="name" stack-label @update:model-value="onSelectProject">
            <template v-slot:after>
              <q-btn color="green" dense flat icon="add_circle" round @click="openDialogAddProject">
                <q-tooltip>Ajouter un projet déjà existant</q-tooltip>
              </q-btn>
            </template>
          </q-select>

          <q-item dense exact to="/generate/init">
            <q-item-section avatar>
              <q-icon color="grey-6" name="create_new_folder"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Créer un nouveau projet</q-item-label>
            </q-item-section>
          </q-item>

          <q-list v-if="project != null" dense padding>
            <q-item-label header>Général</q-item-label>

            <q-item dense exact to="/">
              <q-item-section avatar>
                <q-icon color="grey-6" name="space_dashboard"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Tableau de bord</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator dark spaced/>

            <q-item-label header>Génération côté Back</q-item-label>

            <q-item dense exact to="/generate/controller">
              <q-item-section avatar>
                <q-icon color="grey-6" name="api"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Controlleur</q-item-label>
                <q-item-label caption>Génération d'un controlleur Rest</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset="item" spaced/>

            <q-item dense exact to="/generate/ref">
              <q-item-section avatar>
                <q-icon color="grey-6" name="view_list"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Referentiel</q-item-label>
                <q-item-label caption>Permet de créer les classes de type referentiel</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset="item" spaced/>

            <q-item dense exact to="/generate/timer">
              <q-item-section avatar>
                <q-icon color="grey-6" name="view_list"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Timer</q-item-label>
                <q-item-label caption>Crée une classe de timer et le script SQL associé</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator dark spaced/>

            <q-item-label header>Génération côté Front</q-item-label>

            <q-item dense exact to="/generate/page">
              <q-item-section avatar>
                <q-icon color="grey-6" name="article"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Page</q-item-label>
                <q-item-label caption>Génération d'une page .vue</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset="item" spaced/>

            <q-item dense exact to="/generate/store">
              <q-item-section avatar>
                <q-icon color="grey-6" name="save"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Store</q-item-label>
                <q-item-label caption>Génération d'un store Nuxt</q-item-label>
              </q-item-section>
            </q-item>
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
