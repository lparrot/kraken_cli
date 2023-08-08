import {ComponentInternalInstance} from 'vue'
import {FormContext} from "vee-validate";

export function getParentComponentIfExists(instance: ComponentInternalInstance, name: string) {
    let component = null

    while (component == null && instance != null) {
        if (instance.parent?.proxy?.$options.name === name) {
            component = instance.parent?.proxy
        }
    }

    return component
}

export async function validateFields(form: FormContext, fields: string[]) {
    await nextTick(async () => {
        for await (let field of fields) {
            await form.validateField(field)
        }
    })
}
