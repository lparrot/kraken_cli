<script lang="ts" setup>
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";

interface Props {
  root?: string
}

const $q = useQuasar()
const $state = useStateStore()
const $api = useApiStore()

const props = defineProps<Props>()

const modelValue = defineModel<string>({default: null})

const emit = defineEmits<{
  select: [data: any]
}>()

const folder_info = ref<any>()

if (modelValue.value == null) {
  if (props.root == null && $state.project) {
    modelValue.value = $state.project?.path
  } else {
    modelValue.value = props.root!
  }
}

async function select_folder(folder) {
  modelValue.value = folder.path
  emit('select', modelValue.value)
}

async function select_parent() {
  modelValue.value = folder_info.value.parent
  emit('select', modelValue.value)
}

function handleNewDirectory() {
  $q.dialog({
    title: 'Nouveau dossier',
    message: 'Donnez le nom du nouveau dossier',
    prompt: {
      model: '',
      isValid: val => val.length > 0,
      type: 'text'
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data: string) => {
    await $api.handleCreateNewDirectory(folder_info.value.path, data)
    folder_info.value = await $api.fetchPathInfo(folder_info.value.path, props.root)
  })
}

async function fetchInfo(path: string) {
  if (path != null) {
    folder_info.value = await $api.fetchPathInfo(path, props.root)
  }
}

await fetchInfo(modelValue.value)

watch(modelValue, async (value) => {
  await fetchInfo(value)
})

const canGoToParent = computed(() => {
  return folder_info.value?.parent?.startsWith(props.root + $state.infos.separator)
})
</script>

<template>
  <q-markup-table bordered dense flat square>
    <tbody>
    <q-tr>
      <q-td>
        <div class="row items-center q-gutter-xs">
          <q-btn v-for="bread in folder_info?.breadcrumb" color="green-3" dense size="sm" unelevated @click="select_folder(bread)">{{ bread.label }}</q-btn>
        </div>
      </q-td>
    </q-tr>
    <q-tr>
      <q-td>
        <div class="row items-center q-gutter-xs">
          <q-btn color="orange" dense icon="add" label="Nouveau dossier" size="sm" unelevated @click="handleNewDirectory"/>
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
    <q-tr v-for="folder in folder_info?.children" class="cursor-pointer" @click="select_folder(folder)">
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
