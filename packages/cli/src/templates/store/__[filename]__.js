export const state = () => ({
	// x: 'y'
})

export const getters = {
	getX(state) {
		// return state.x
	}
}

export const mutations = {
	UPDATE_X(state, payload) {
		// state.x = payload
	}
}

export const actions = {
	async x({ state, commit }, payload) {
		// commit('UPDATE_X', payload)
		// return state.x;
	}
}