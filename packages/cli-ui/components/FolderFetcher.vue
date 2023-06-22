<script lang="ts" setup>
import {useStateStore} from "~/store/state";
import {useApiStore} from "~/store/api";
import {whenever} from "@vueuse/core";
import sortBy from "lodash/sortBy";

interface Props {
  root?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [data: any]
}>()

const $state = useStateStore()
const $api = useApiStore()

const modelValue = defineModel<string | null>({default: null})
const filter = ref('')
const filterRef = ref()
const treeRef = ref()
const expanded = ref([])
const folders = ref([])

let rootDir

if (props.root == null && $state.project) {
  rootDir = $state.project?.path
} else {
  rootDir = props.root
}

folders.value = await $api.fetchFolders(rootDir)

const rootdir = await $api.fetchJavaRootDir(rootDir)

function filterFn(node, filter) {
  const packageName = convertPathToPackage(node.path)
  if (isNotBlank(filter) && node.path != null && packageName.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
    selectNode(node.path)
    return true
  }
  return false
}

function selectNode(key, node?) {
  if (key == null) {
    return
  }
  if (expanded.value.indexOf(key) < 0) {
    let rooted = false
    let current_node = node == null ? treeRef.value.getNodeByKey(key) : node

    if (current_node == null) {
      return
    }

    while (!rooted) {
      if (expanded.value.indexOf(current_node.path) < 0) {
        expanded.value.push(current_node.path)
        expanded.value = sortBy(expanded.value)
      }
      if (current_node.root) {
        rooted = true
      } else {
        current_node = treeRef.value.getNodeByKey(current_node.dirname)
      }
    }
  }
}

async function resetFilter() {
  filter.value = ''
  filterRef.value.focus()
}

watch(modelValue, () => {
  selectNode(modelValue.value)
})

whenever(() => treeRef.value != null, () => {
  selectNode(modelValue.value != null ? modelValue.value : rootdir)
})
</script>

<template>
  <q-input ref="filterRef" v-model="filter" class="q-mb-md" debounce="500" dense filled label="Recherche de dossier" stack-label>
    <template v-slot:append>
      <q-icon v-if="filter !== ''" class="cursor-pointer" name="clear" @click="resetFilter"/>
    </template>
  </q-input>

  <q-tree ref="treeRef" v-model:expanded="expanded" v-model:selected="modelValue" :filter="filter" :filter-method="filterFn" :nodes="folders" dense node-key="path" @update:selected="emit('select', $event)">
    <template #default-header="prop">
      <div class="row items-center q-gutter-xs">
        <q-icon color="orange" name="folder"></q-icon>
        <div>{{ prop.node.label }}</div>
      </div>
    </template>
  </q-tree>
</template>

<style scoped>

</style>
