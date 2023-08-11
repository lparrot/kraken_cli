import { VerticalNavigationLink } from '@nuxthq/ui/dist/runtime/types'

type CustomVerticalNavigationLink = VerticalNavigationLink & { showIf?: boolean }

export interface NavigationItem {
  label: string
  items?: CustomVerticalNavigationLink[]
}
