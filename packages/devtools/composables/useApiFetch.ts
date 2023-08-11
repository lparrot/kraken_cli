import { NitroFetchOptions } from 'nitropack'

export const useApiFetch = <T>(input: string, opts?: NitroFetchOptions<any>): Promise<T> => {
  return $fetch<T>(input.toString(), {
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
}
