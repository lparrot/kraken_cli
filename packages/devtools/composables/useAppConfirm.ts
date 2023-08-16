const confirming = ref<boolean>(false)

interface ConfirmParams {
    title: string
    message: string
    label: string
    prompt?: PromptOptions
    action: Function
}

interface PromptOptions {
    model: any
    isValid?: (val: any) => boolean
}

const params = ref<ConfirmParams>({
    title: 'Titre',
    message: 'Description',
    label: 'Valider',
    action: () => {
    },
})

export const useAppConfirm = () => {
    function confirm(_params: ConfirmParams) {
        params.value = {..._params}
        confirming.value = true
    }

    return {
        confirm,
        confirming,
        params,
    }
}
