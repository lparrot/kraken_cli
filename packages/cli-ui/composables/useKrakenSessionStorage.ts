import {useSessionStorage} from "@vueuse/core";

interface KrakenUiStorageOptions {
  selection: {
    project?: number
  },
  init: {
    folder?: string
  }
}

const initialSessionValue: KrakenUiStorageOptions = {
  selection: {
    project: undefined
  },
  init: {
    folder: undefined
  }
}

export function useKrakenSessionStorage() {
  return useSessionStorage('kraken.ui.storage', initialSessionValue, {mergeDefaults: true})
}
