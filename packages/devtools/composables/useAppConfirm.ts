const confirming = ref<boolean>(false)

interface ConfirmParams {
  title: string
  message: string
  label: string
  action: Function
}

const params = ref<ConfirmParams>({
  title: 'Titre',
  message: 'Description',
  label: 'Valider',
  action: () => {
  },
})

export const useAppConfirm = () => {
  function confirm(title: string, message: string, label: string, action: Function) {
    params.value = { title, message, label, action }
    confirming.value = true
  }

  return {
    confirm,
    confirming,
    params,
  }
}
