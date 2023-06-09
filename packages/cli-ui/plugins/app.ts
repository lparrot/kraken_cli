export default defineNuxtPlugin(nuxt => {
	return {
		provide: {
			log: console.log
		}
	}
})