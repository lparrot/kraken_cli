import { NavigationItem } from '~/types'

let menu = ref<NavigationItem[] | undefined>()

export function useAppMenu() {
  function setMenu(newMenu: NavigationItem[]) {
    menu.value = newMenu
  }

  return {
    menu,
    setMenu
  }
}
