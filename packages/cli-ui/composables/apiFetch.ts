import {NitroFetchOptions} from "nitropack";
import {Notify} from "quasar";

export const useApiFetch = <T>(request: string, opts?: NitroFetchOptions<any>): Promise<T> => {
  const config = useRuntimeConfig()

  return $fetch<T>(request, {
    retry: false,

    baseURL: `http://localhost:${config.public.API_PORT}`,

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
      if (response.status === 500) {
        Notify.create({
          color: 'red',
          message: response._data.error
        })
      }
    },

    ...opts
  })
}
