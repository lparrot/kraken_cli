import {Notify} from "quasar";
import {NitroFetchOptions} from "nitropack";

export const useApiFetch = <T>(input: string, opts?: NitroFetchOptions<any>): Promise<T> => {
  const config = useRuntimeConfig()

  return $fetch<T>(input.toString(), {
    retry: false,

    onRequest({request, options}) {
      // Set the request headers
    },

    onRequestError({request, options, error}) {
      // Handle the request errors
    },

    onResponse({request, response, options}) {
      // Process the response data
      return response._data
    },

    onResponseError({request, response, options}) {
      // Handle the response errors
      if (Notify != null) {
        if (response.status === 500) {
          Notify.create({
            color: 'red',
            message: response._data.error?.message
          })
        }
        if (response.status === 400) {
          if (response._data.message != null) {
            Notify.create({
              color: 'red',
              message: response._data.message
            })
          }
        }
      }
    },

    ...opts
  })
}
