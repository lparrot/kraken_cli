export default defineAppConfig({
    ui: {
        notifications: {
            position: 'bottom-0 left-0'
        },

        slideover: {
            wrapper: 'fixed inset-0 flex z-40',
        },

        modal: {
            wrapper: 'relative z-40',
        },

        selectMenu: {
            option: {
                container: 'flex items-center gap-2 min-w-0 w-full'
            }
        }
    }
})
