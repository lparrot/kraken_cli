const confirming = ref<boolean>(false)

interface ConfirmParams {
    title: string
    message: string
    label: string
    prompt?: PromptOptions
    buttons: ButtonsOptions
    action: Function
    attachTo: string | HTMLElement
}

interface PromptOptions {
    model: any
    isValid?: (val: any) => boolean
}

interface ButtonsOptions {
    ok?: ButtonAttributes
    cancel?: ButtonAttributes
}

interface ButtonAttributes {
    color?: string
}

const params = ref<Partial<ConfirmParams>>({})

export const useAppConfirm = () => {
    function confirm(_params: Partial<ConfirmParams>) {
        const defaultOptions: Partial<ConfirmParams> = {
            title: 'Titre',
            message: 'Description',
            label: 'Valider',
            attachTo: 'body',
            buttons: {
                cancel: {
                    color: 'white'
                }
            },
            action: () => {
            },
        }
        params.value = Object.assign({}, defaultOptions, _params)

        console.log(params.value)

        confirming.value = true
    }

    return {
        confirm,
        confirming,
        params,
    }
}
