import {useSessionStorage} from "@vueuse/core";

export function useKrakenSessionStorage() {
  return useSessionStorage('kraken-ui-storage', {init: {folder: null}}, {mergeDefaults: true})
}
