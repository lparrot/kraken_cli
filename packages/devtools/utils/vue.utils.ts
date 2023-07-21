import {ComponentInternalInstance} from 'vue'

export default function getParentComponentIfExists(instance: ComponentInternalInstance, name: string) {
  let component = null

  while (component == null && instance != null) {
    if (instance.parent?.proxy?.$options.name === name) {
      component = instance.parent?.proxy
    }
  }

  return component
}
