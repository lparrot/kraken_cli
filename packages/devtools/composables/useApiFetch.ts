import {NitroFetchOptions} from 'nitropack'

export const useApiFetch = async <T>(input: string, opts?: NitroFetchOptions<any>): Promise<T | undefined> => {
    const result = await $fetch<T>(input.toString(), {
    retry: false,

    onRequest({}) {
      // Set the request headers
    },

    onRequestError({}) {
      // Handle the request errors
    },

    onResponse({ response }) {
      // Process the response data
      return response._data
    },

    onResponseError({}) {

    },

    ...opts
  })

    if (typeof result === 'string' && isBlank(result)) {
        return undefined
    }

    return result
}
