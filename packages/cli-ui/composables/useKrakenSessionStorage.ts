import {useSessionStorage} from "@vueuse/core";

interface KrakenUiStorageOptions {
  selection: {
    project?: number
  },
}

const initialSessionValue: KrakenUiStorageOptions = {
  selection: {
    project: undefined
  },
}

export function useKrakenSessionStorage() {
  return useSessionStorage('kraken.ui.storage', initialSessionValue, {mergeDefaults: true})
}
