<script lang="ts" setup>
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";

interface Props {
  readonly root?: string
  readonly defaultDir?: string
  readonly autoSelect?: boolean
  readonly showHome?: boolean
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()

const props = withDefaults(defineProps<Props>(), {
  autoSelect: true,
  showHome: false
})

const modelValue = defineModel<string | null>({default: null})

const emit = defineEmits<{
  select: [data: any]
}>()

const folder_info = ref<any>()

const canGoToParent = computed(() => {
  return folder_info.value?.parent?.startsWith(rootDir.value)
})

const rootDir = computed(() => {
  return props.root != null ? props.root : ''
})

async function click_folder(path) {
  if (path === rootDir.value) {
    return
  }
  if (props.autoSelect) {
    modelValue.value = path
    emit('select', modelValue.value)
  }
  await fetchInfo(path)
}

async function select_parent() {
  if (folder_info.value.path === rootDir.value) {
    return
  }

  if (props.autoSelect) {
    if (folder_info.value.parent === rootDir.value) {
      modelValue.value = null
    } else {
      modelValue.value = folder_info.value.parent
    }
    emit('select', modelValue.value)
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

function onSelect() {
  modelValue.value = folder_info.value.path
  emit('select', modelValue.value)
}

await fetchInfo(modelValue.value != null ? modelValue.value! : props.defaultDir || rootDir.value)
</script>

<template>
  <q-markup-table bordered dense flat square>
    <tbody>
    <q-tr>
      <q-td>
        <div class="row items-center q-gutter-xs">
          <q-btn v-for="bread in folder_info?.breadcrumb" color="green-3" dense size="sm" unelevated @click="click_folder(bread.path)">{{ bread.label }}</q-btn>
        </div>
      </q-td>
    </q-tr>
    <q-tr>
      <q-td>
        <div class="row items-center q-gutter-xs">
          <q-btn v-if="!autoSelect" color="blue" dense icon="check" size="sm" unelevated @click="onSelect">
            <q-tooltip>Selection du dossier actuel</q-tooltip>
          </q-btn>
          <q-btn color="green" dense icon="add" size="sm" unelevated @click="handleNewDirectory">
            <q-tooltip>Création d'un nouveau répertoire</q-tooltip>
          </q-btn>
          <q-btn v-if="props.showHome" color="orange" dense icon="home" size="sm" unelevated @click="click_folder($state.infos.home_dir)">
            <q-tooltip>Déplacement vers le dossier utilisateur</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </q-tr>
    <q-tr :class="{'cursor-pointer': canGoToParent, 'bg-grey-3': !canGoToParent}">
      <q-td auto-width @click="canGoToParent ? select_parent() : null">
        <div class="row items-center q-gutter-sm">
          <q-icon color="blue" name="arrow_back"/>
          <div>...</div>
        </div>
      </q-td>
    </q-tr>
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
</template>

<style scoped>

</style>
