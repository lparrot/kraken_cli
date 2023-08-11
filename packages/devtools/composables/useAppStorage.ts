import { useSessionStorage } from '@vueuse/core'

interface AppStorageOptions {
  selected_project?: number
}

const initialStorageValue: AppStorageOptions = {
  selected_project: undefined
}

export function useAppStorage() {
  return useSessionStorage('kraken.devtools', initialStorageValue, { mergeDefaults: true })
}
