interface LoaderOptions {
  title: string
  description: string
}

const defaults = {
  DESCRIPTION: 'Une action est en cours de traitement.'
}

const show = ref(false)
const title = ref()
const description = ref(defaults.DESCRIPTION)

export function useAppLoader() {
    function start(options?: Partial<LoaderOptions>) {
        options = Object.assign({}, options)
    show.value = true
    title.value = options.title
    description.value = options.description ?? defaults.DESCRIPTION
  }

  function stop() {
    show.value = false
  }

  return {
    start,
    stop,
    show,
    title,
    description
  }
}
