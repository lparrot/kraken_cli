<script lang="ts" setup>
const drawer = ref(true)
const projects = useState('projects')

function toggleDrawer() {
  drawer.value = !drawer.value
}

async function getProjects() {
  const {projects: res} = await useApiFetch('/api/projects')
  projects.value = res
}

async function addProject() {
  const {projects} = await useApiFetch('/api/projects', {
    method: 'post',
    body: {name: 'CCS NG', path: 'C:/Users/laure/IdeaProjects/ccs_ng'},
  })
  projects.value = projects
}

await getProjects()
</script>

<template>
  <suspense>
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
        <q-list dense padding>
          <q-item-label header>Général</q-item-label>

          <q-item dense exact to="/">
            <q-item-section avatar>
              <q-icon color="grey-6" name="space_dashboard"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Tableau de bord</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable dense @click="addProject">
            <q-item-section avatar>
              <q-icon color="grey-6" name="add"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Ajouter un projet</q-item-label>
            </q-item-section>
          </q-item>

          <q-item dense exact to="/generate/init">
            <q-item-section avatar>
              <q-icon color="grey-6" name="create_new_folder"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Créer un nouveau projet</q-item-label>
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
  </suspense>
</template>

<style scoped>

</style>
