<script lang="ts" setup>
import {useStateStore} from '~/store/state'
import {useApiStore} from '~/store/api'
import {getParentComponentIfExists} from '~/utils/vue.utils'
import {QDrawer} from 'quasar'

interface Props {
  readonly defaultDir?: string
  readonly root?: string
  readonly showHome?: boolean
  readonly check?: (path: string) => Promise<boolean>
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()
const instance = getCurrentInstance()


//@ts-ignore
const props = withDefaults(defineProps<Props>(), {
  showHome: false
})

const modelValue = defineModel<string | null>({ default: null })

const emit = defineEmits<{
  select: [data: any]
  close: []
}>()

const folder_info = ref<any>()

const canGoToParent = computed(() => {
  return folder_info.value?.parent?.startsWith(rootDir.value)
})

const rootDir = computed(() => {
  return props.root != null ? props.root : ''
})

async function click_folder(path: string) {
  if (path === rootDir.value) {
    return
  }
  await fetchInfo(path)
}

async function select_parent() {
  if (folder_info.value.path === rootDir.value) {
    return
  }

  await fetchInfo(folder_info.value.parent)
}

function handleNewDirectory() {
  $q.dialog({
    title: 'Nouveau dossier',
    message: 'Donnez le nom du nouveau dossier',
    prompt: {
      model: '',
      isValid: (val) => val.length > 0,
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data: string) => {
    await $api.handleCreateNewDirectory(folder_info.value.path, data)
    folder_info.value = await $api.fetchPathInfo(folder_info.value.path, rootDir.value)
  })
}

async function fetchInfo(path?: string) {
  if (path != null) {
    folder_info.value = await $api.fetchPathInfo(path, rootDir.value)
  }
}

async function onSelect() {
  if (props.check == null || await props.check(folder_info.value.path!)) {
    modelValue.value = folder_info.value.path
    emit('select', modelValue.value)
    onClose()
  }
}

function onClose() {
  emit('close')
  const drawer = getParentComponentIfExists(instance!, 'QDrawer') as QDrawer
  if (drawer != null) {
    drawer.hide()
  }
}

await fetchInfo(modelValue.value != null ? modelValue.value! : props.defaultDir || rootDir.value)
</script>

<template>
  <q-layout container view="lHh lpr lFf">
    <q-header class="bg-white">
      <div class="row">
        <q-space/>
        <q-btn class="text-black" dense flat icon="close" round @click="onClose"/>
      </div>

      <q-list bordered dense separator>
        <q-item>
          <div class="row items-center q-gutter-xs">
            <q-btn color="green-3" dense disable size="sm" unelevated>/</q-btn>
            <q-btn v-for="bread in folder_info?.breadcrumb" color="green-3" dense size="sm" unelevated @click="click_folder(bread.path)">{{ bread.label }}</q-btn>
          </div>
        </q-item>
        <q-item>
          <div class="row row items-center q-gutter-xs">
            <q-btn :disable="!canGoToParent" color="blue" dense icon="arrow_back" size="sm" unelevated @click="select_parent()">
              <q-tooltip v-if="canGoToParent" :delay="200">Revenir au répertoire précédent</q-tooltip>
            </q-btn>
            <q-btn color="green" dense icon="add" size="sm" unelevated @click="handleNewDirectory">
              <q-tooltip>Création d'un nouveau répertoire</q-tooltip>
            </q-btn>
            <q-btn v-if="props.showHome" color="orange" dense icon="home" size="sm" unelevated @click="click_folder($state.infos?.home_dir!)">
              <q-tooltip>Déplacement vers le dossier utilisateur</q-tooltip>
            </q-btn>
          </div>
        </q-item>
      </q-list>
    </q-header>

    <q-page-container>
      <q-markup-table class="col-auto" dense flat square>
        <tbody>
        <q-tr v-for="folder in folder_info?.children" class="cursor-pointer" @click="click_folder(folder.path)">
          <q-td auto-width>
            <div class="row items-center q-gutter-sm">
              <q-icon color="orange" name="folder"/>
              <div>{{ folder.label }}</div>
            </div>
          </q-td>
        </q-tr>
        </tbody>
      </q-markup-table>
    </q-page-container>

    <q-footer>
      <q-btn class="full-width col-auto" color="primary" icon="check" unelevated @click="onSelect">Selectionner le dossier</q-btn>
    </q-footer>
  </q-layout>
</template>

<style scoped>

</style>
