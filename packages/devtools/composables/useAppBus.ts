export function useAppBus() {
  return {
    projects: useEventBus('projects')
  }
}
