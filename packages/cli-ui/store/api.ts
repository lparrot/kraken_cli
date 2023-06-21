export const useApiStore = defineStore('api', {
  actions: {
    async fetchFolders(path: string): Promise<any[]> {
      return useApiFetch('/api/fs/files', {
        query: {
          path
        }
      })
    }
  }
})
