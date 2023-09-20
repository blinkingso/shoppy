import router from './router'
import { getToken } from './composables/auth'
import { toast } from './composables/util'
import store from './store'

// Global Gurad
router.beforeEach(async (to, from) => {
    const token = getToken()

    // return back to login page
    if (!token && to.path !== '/login') {
        toast("请先登录", "error")
        return '/login'
    }

    // avoid repeat login
    if (token && to.path == '/login') {
        return from.path ? from.path : '/'
    }

    try {
        // store userinfo
        if (token && !store.state.routesLoaded) {
            await store.dispatch('getinfo')
            store.commit('setActiveMenu', to.path)
            return to.fullPath
        }
    } catch (e) {
        return `/login?redirect=${to.path}`
    }

    return true
})