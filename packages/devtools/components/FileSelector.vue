<script lang="ts" setup>
import {OsPathInfo} from "@kraken/types";

interface Props {
  readonly check?: (path: OsPathInfo) => Promise<boolean>
  readonly defaultDir?: string
  readonly root?: string
  readonly showHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultDir: '',
  root: '',
  showHome: false
})

const emit = defineEmits<{
  select: [data: any]
  close: []
}>()

const modelValue = defineModel<string>()
const show = defineModel('show')

const path_info = ref<OsPathInfo>()
const $api = useApiStore()
const $state = useStateStore()
const $confirm = useAppConfirm()

const canGoToParent = computed(() => path_info.value?.parent?.startsWith(rootDir.value))
const currentPath = computed(() => isNotBlank(modelValue.value) ? modelValue.value! : props.defaultDir || rootDir.value)
const rootDir = computed(() => props.root != null ? props.root : '')

async function clickFolder(path: string) {
  await fetchPathInfos(path)
}

async function selectParent() {
  if (path_info.value!!.path === props.root) {
    return
  }

  await fetchPathInfos(path_info.value!!.parent)
}

async function fetchPathInfos(path?: string) {
  if (path != null) {
    path_info.value = await $api.fetchOsPathInfo(path, props.root)
  }
}

async function addFolder() {
  $confirm.confirm({
    title: 'Nouveau répertoire',
    message: `Donnez le nom du nouveau répertoire`,
    label: 'Créer le répertoire',
    prompt: {
      model: '',
      isValid: (prompt: string) => isNotBlank(prompt)
    },
    action: async (prompt: string) => {
      try {
        await $api.handleFsCreateDir({cwd: path_info.value!!.path, name: prompt})
        await fetchPathInfos(path_info.value!!.path)
      } catch (err) {
        return false
      }
    }
  })
}

async function submit() {
  if (props.check == null || await props.check(path_info.value!)) {
    await nextTick(async () => {
      modelValue.value = path_info.value!!.path
      emit('select', modelValue.value)
      show.value = false

      const instance = getCurrentInstance()
      instance?.proxy?.$forceUpdate()
    })
  }
}

watch(
    show,
    async (value) => {
      if (value) {
        await fetchPathInfos(currentPath.value)
      }
    },
    {immediate: true}
)
</script>

<template>
  <USlideover v-model="show" prevent-close side="right">
    <div class="flex flex-col h-full">
      <div class="py-2 px-4 flex justify-end border-b">
        <UButton icon="i-ic-close" @click="show = false"/>
      </div>

      <div class="py-2 px-4 flex gap-1.5 border-b">
        <UButton :disabled="!canGoToParent" color="blue" icon="i-ic-arrow-back" variant="ghost" @click="selectParent"/>
        <UButton color="green" icon="i-ic-add" variant="ghost" @click="addFolder"/>
        <UButton v-if="props.showHome" color="orange" icon="i-ic-home" variant="ghost"
                 @click="clickFolder($state.os_infos!!.home_dir)"/>
      </div>

      <div class="h-full overflow-auto">
        <template v-for="item in path_info?.children">
          <div class="py-1 px-4 border-b cursor-pointer hover:bg-primary-100" @click="clickFolder(item.path)">
            <div class="flex items-center gap-1.5">
              <UIcon class="text-yellow-400" name="i-ic-folder"></UIcon>
              <div class="text-sm">{{ item.label }}</div>
            </div>
          </div>
        </template>
      </div>

      <UButton class="justify-center rounded-none" color="green" icon="i-ic-check" @click="submit">
        <div>OK</div>
      </UButton>
    </div>
  </USlideover>
</template>

<style scoped>

</style>
