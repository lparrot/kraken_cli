import { FormContext } from 'vee-validate'

export async function validateFields(form: FormContext | undefined, fields: string[]) {
  if (form == null) {
    return false
  }

  await nextTick(async () => {
    for await (let field of fields) {
      await form.validateField(field, { mode: 'silent', warn: false })
    }
  })
}
