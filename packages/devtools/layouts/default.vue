<script lang="ts" setup>
import VerticalSeparator from '~/components/VerticalSeparator.vue'
import { FormContext } from '~/node_modules/vee-validate'
import { OsPathInfo } from '@kraken/types'
import DynamicModal from '~/components/DynamicModal.vue'

interface FormAddProject {
  path: string
  name: string
}

interface FormLaunchApplication {
  profile?: string
}

const {isTabletOrMobile} = useMedia()
const $storage = useAppStorage()
const confirm = useAppConfirm()
const $swal = useSwal()
const $state = useStateStore()
const $api = useApiStore()
const $bus = useAppBus()
const $loader = useAppLoader()

const validator = ref<FormContext>()

const form_add_project = ref<Partial<FormAddProject>>({})
const form_launch_application = ref<Partial<FormLaunchApplication>>({})

const app_profiles = ref<string[] | undefined>([])

await $state.refreshSelectedProject()

const show = ref({
  fileselector_project: false,
  modal_add_project: false,
  modal_launch_application: false
})

async function removeProjectFromList() {
  confirm.confirm({
    title: 'Etes vous sûr(e) ?',
    message: `Ceci n'entrainera pas la suppression physique du dossier du projet. Le projet n'apparaitra tout simplement plus dans la liste.`,
    label: 'Supprimer',
    action: async () => {
      await $api.handleProjectRemove($state.project!!.id)

      $state.unselectProject()

      $bus.projects.emit()

      await navigateTo('/')
    }
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
  form_launch_application.value.profile = app_profiles.value?.[0]
}

async function stopApplication() {
  confirm.confirm({
    title: 'Etes vous sûr ?',
    message: `Confirmez vous la fermeture de l'instance de l'application ?`,
    label: `Fermer l'application`,
    action: async () => {
      await $api.handleProjectExit()
    }
  })
}

async function compileApplication() {
  $loader.start()
  try {
    await $api.handleProjectCompile()
  } finally {
    $loader.stop()
  }
}

async function checkAddProjectSelected(path_info: OsPathInfo) {
  const paths = await $api.fetchProjectPaths(path_info?.path)

  if (paths == null) {
    await $swal.fire({
      icon: 'error',
      text: 'Le dossier selectionné ne correspond pas à un projet Kraken valide'
    })
    return false
  }

  const project = $state.projects!!.find(it => it.path === paths.project_path)

  if (project != null) {
    await $swal.fire({
      icon: 'error',
      text: `Le projet a déjà été référencé sous le nom ${project.name}`
    })
    return false
  }

  form_add_project.value.name = path_info.label
  return true

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
    $loader.start({description: `Lancement de l'application en cours ...`})
    await $api.handleProjetRun($state.project?.path!, {profile: form_launch_application.value.profile})
  } finally {
    $loader.stop()
  }
}

async function handleInputChangeProject(projectId: number) {
  await $state.setProject(projectId)
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
            <USelectMenu v-model="$storage.selected_project" :options="$state.projects" option-attribute="name" searchable searchable-placeholder="Rechercher un projet" value-attribute="id" @change="handleInputChangeProject">
              <template #label>
                {{ $state.project?.name ?? 'Selectionner un projet' }}
              </template>
            </USelectMenu>
          </div>
          <UButton icon="i-ic-add" variant="ghost" @click="showModalAddProject"></UButton>
          <template v-if="$state.project != null">
            <UButton color="red" icon="i-mdi-trash" title="Retire le projet de la liste" variant="ghost" @click="removeProjectFromList"></UButton>
            <UButton color="orange" icon="i-ic-folder" title="Ouvre le dossier du projet dans l'explorateur" variant="ghost" @click="openInExplorer"></UButton>
            <UButton color="orange" title="Ouvre le projet dans Intellij Idea" variant="ghost" @click="openInIntellijIdea">
              <img alt="idea_icon" class="w-5" src="/idea.png">
            </UButton>
            <VerticalSeparator class="bg-gray-400"/>
            <UButton icon="i-mdi-refresh" title="Re-compile l'application" variant="ghost" @click="compileApplication"/>
            <UButton v-if="!$state.ping" color="green" icon="i-mdi-play" variant="ghost"
                     title="Démarre l'application" @click="showModalLaunchApplication"/>
            <UButton v-else color="red" icon="i-mdi-stop" title="Arrête l'application en cours" variant="ghost" @click="stopApplication"/>
          </template>
        </div>
        <div class="p-2 h-full overflow-auto">
          <slot></slot>
        </div>
      </div>
    </Content>
  </div>

  <UModal v-model="show.modal_add_project" prevent-close>
    <VeeForm ref="validator" #default="{meta, errors}" :initial-values="form_add_project" validate-on-mount
             @submit="submitAddProject">
      <UCard>
        <template #header>
          <div class="font-semibold">Ajout d'un projet</div>
        </template>

        <div class="space-y-4">
          <UFormGroup :error="errors?.path!" label="Chemin du projet">
            <div class="flex gap-1.5">
              <UInput v-model="form_add_project.path" :ui="{wrapper: 'relative w-full'}" disabled/>
              <UButton color="blue" icon="i-ic-search" variant="ghost"
                       @click="show.fileselector_project = true"></UButton>
            </div>
          </UFormGroup>

          <template v-if="isNotBlank(form_add_project.path!)">
            <VeeField v-model="form_add_project.name" #default="{errorMessage, field}" as="" label="nom du projet"
                      name="name" rules="required">
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
        <URadio v-for="profile in app_profiles" :key="profile" v-model="form_launch_application.profile"
                :label="profile" :name="profile" :value="profile"/>
      </UFormGroup>

      <template #footer>
        <div class="flex justify-end gap-1.5">
          <UButton @click="show.modal_launch_application = false">Annuler</UButton>
          <UButton @click="submitLaunchApplication">Lancer l'application</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <FileSelector v-model="form_add_project.path" v-model:show="show.fileselector_project"
                :check="checkAddProjectSelected"
                :default-dir="$state.os_infos?.home_dir" show-home></FileSelector>

  <Teleport to="body">
    <UNotifications/>
    <OverlayLoaderBlockScreen/>
  </Teleport>

  <DynamicModal/>

</template>

<style scoped>

</style>
