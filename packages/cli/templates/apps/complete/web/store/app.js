export const state = () => ({
  profils: []
})

export const getters = {}

export const mutations = {
  UPDATE_PROFILS(state, profils) {
    state.profils = profils
  }
}

export const actions = {
  async fetchProfils({commit}) {
    const {data} = await this.$axios.$get(`/api/entity_options`, {params: {entity: 'Profil', textField: 'libelle', valueField: 'id', roles: 'ADMIN'}})
    commit('UPDATE_PROFILS', data)
  }
}
