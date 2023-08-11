<script lang="ts" setup>
import VerticalSeparator from '~/components/VerticalSeparator.vue'
import {FormContext} from '~/node_modules/vee-validate'

interface FormAddProject {
  path: string
  name: string
}

interface FormLaunchApplication {
  profile: string
}

const { isTabletOrMobile } = useMedia()
const storage = useAppStorage()
const toast = useToast()
const confirm = useAppConfirm()
const $state = useStateStore()
const $api = useApiStore()
const $bus = useAppBus()
const $loader = useAppLoader()

const validator = ref<FormContext>()

const form_add_project = ref<Partial<FormAddProject>>({})
const form_launch_application = ref<Partial<FormLaunchApplication>>({})

const app_profiles = ref<string[]>([])

const show = ref({
  fileselector_project: false,
  modal_add_project: false,
  modal_launch_application: false
})

async function removeProjectFromList() {
  confirm.confirm(
    'Etes vous sûr(e) ?',
    `Ceci n'entrainera pas la suppression physique du dossier du projet. Le projet n'apparaitra tout simplement plus dans la liste.`,
    'Supprimer',
    async () => {
      await $api.handleProjectRemove($state.project!!.id)

      await navigateTo('/')
      await $state.setProject(undefined)
      $bus.projects.emit()
    })
}

async function openInExplorer() {
  await $api.handleProjectOpenInExplorer($state.project!!.path)
}

async function openInIntellijIdea() {
  await $api.handleProjectOpenInIntellijIdea($state.project!!.path)
}

function showModalAddProject() {
  form_add_project.value = {}
  show.value.modal_add_project = true
}

async function showModalLaunchApplication() {
  app_profiles.value = await $api.fetchAppProfiles()
  show.value.modal_launch_application = true
  form_launch_application.value.profile = app_profiles.value[0]
}

async function stopApplication() {
  confirm.confirm('Etes vous sûr ?', `Confirmez vous la fermeture de l'instance de l'application ?`, `Fermer l'application`, async () => {
    await $api.handleProjectExit()
  })
}

async function checkAddProjectSelected(path_info: any) {
  const paths = await $api.fetchProjectPaths(path_info?.path)

  if (paths != null) {
    const project = $state.projects!!.find(it => it.path === paths.project_path)
    if (project != null) {
      toast.add({
        color: 'red',
        description: `Le projet a déjà été référence sous le nom ${project.name}`
      })
    } else {
      form_add_project.value.name = path_info.label
      return true
    }
  } else {
    toast.add({
      color: 'red',
      title: '',
      description: `Le dossier selectionné ne correspond pas à un projet Kraken valide`
    })
  }
  return false
}

async function submitAddProject() {
  const project = await $api.handleProjectCreate(form_add_project.value)
  $bus.projects.emit()
  await $state.setProject(project?.id)
  await navigateTo('/')

  show.value.modal_add_project = false
}

async function submitLaunchApplication() {
  try {
    show.value.modal_launch_application = false
    $loader.start({ description: `Lancement de l'application en cours ...` })
    await $api.handleProjetRun($state.project?.path!, { profile: form_launch_application.value.profile })
  } finally {
    $loader.stop()
  }
}

watch(
  isTabletOrMobile,
  (value) => {
    if (value) {
      $state.navigation = false
    }
  },
  {
    immediate: true
  }
)

watchEffect(() => {
  validator.value?.setFieldError('path', form_add_project.value?.path == null ? 'Le champ chemin du dossier est requis' : undefined)
  }
)
</script>

<template>
  <div class="flex flex-col h-full">
    <Header></Header>

    <Content>
      <div class="flex flex-col w-full h-full">
        <div class="p-2 flex gap-1.5 bg-primary-100">
          <div class="w-64">
            <USelectMenu v-model="storage.selected_project" :options="$state.projects" option-attribute="name" searchable searchable-placeholder="Rechercher un projet" value-attribute="id">
              <template #label>
                {{ $state.project?.name ?? 'Selectionner un projet' }}
              </template>
            </USelectMenu>
          </div>
          <UButton icon="i-ic-add" variant="ghost" @click="showModalAddProject"></UButton>
          <template v-if="$state.project != null">
            <UButton color="red" icon="i-mdi-trash" variant="ghost" @click="removeProjectFromList"></UButton>
            <UButton color="orange" icon="i-ic-folder" variant="ghost" @click="openInExplorer"></UButton>
            <UButton color="orange" variant="ghost" @click="openInIntellijIdea">
              <img alt="idea_icon" class="w-5" src="/idea.png">
            </UButton>
            <VerticalSeparator class="bg-gray-400"/>
            <UButton v-if="!$state.ping" color="green" icon="i-mdi-play" variant="ghost" @click="showModalLaunchApplication"/>
            <UButton v-else color="red" icon="i-mdi-stop" variant="ghost" @click="stopApplication"/>
          </template>
        </div>
        <div class="p-2 h-full overflow-auto">
          <slot></slot>
        </div>
      </div>
    </Content>
  </div>

  <UModal v-model="show.modal_add_project" prevent-close>
    <VeeForm ref="validator" #default="{meta, errors}" :initial-values="form_add_project" validate-on-mount @submit="submitAddProject">
      <UCard>
        <template #header>
          <div class="font-semibold">Ajout d'un projet</div>
        </template>

        <div class="space-y-4">
          <UFormGroup :error="errors?.path!" label="Chemin du projet">
            <div class="flex gap-1.5">
              <UInput v-model="form_add_project.path" :ui="{wrapper: 'relative w-full'}" disabled/>
              <UButton color="blue" icon="i-ic-search" variant="ghost" @click="show.fileselector_project = true"></UButton>
            </div>
          </UFormGroup>

          <template v-if="isNotBlank(form_add_project.path!)">
            <VeeField v-model="form_add_project.name" #default="{errorMessage, field}" as="" label="nom du projet" name="name" rules="required">
              <UFormGroup :error="errorMessage!" label="Nom du projet">
                <div class="flex gap-1.5">
                  <UInput :ui="{wrapper: 'relative w-full'}" v-bind="field"/>
                </div>
              </UFormGroup>
            </VeeField>
          </template>
        </div>

        <template #footer>
          <div class="flex justify-end gap-1.5">
            <UButton @click="show.modal_add_project = false">Annuler</UButton>
            <UButton :disabled="!meta.valid" type="submit">OK</UButton>
          </div>
        </template>
      </UCard>
    </VeeForm>
  </UModal>

  <UModal v-model="show.modal_launch_application">
    <UCard>
      <template #header>
        <div class="font-semibold">Lancer l'application</div>
      </template>

      <UFormGroup label="Profil à utiliser" name="profile">
        <URadio v-for="profile in app_profiles" :key="profile" v-model="form_launch_application.profile" :label="profile" :name="profile" :value="profile"/>
      </UFormGroup>

      <template #footer>
        <div class="flex justify-end gap-1.5">
          <UButton @click="show.modal_launch_application = false">Annuler</UButton>
          <UButton @click="submitLaunchApplication">Lancer l'application</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <FileSelector v-model="form_add_project.path" v-model:show="show.fileselector_project" :check="checkAddProjectSelected"
                :default-dir="$state.os_infos?.home_dir" show-home></FileSelector>

  <Teleport to="body">
    <UNotifications/>
    <OverlayLoaderBlockScreen/>
    <ConfirmationModal/>
  </Teleport>

</template>

<style scoped>

</style>
