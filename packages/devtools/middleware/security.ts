export default defineNuxtRouteMiddleware(async (to, from) => {
    const $state = useStateStore()

    if ($state.project == null) {
        await useRouter().push('/')
        return
    }
})
