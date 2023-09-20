import { createStore } from 'vuex'
import { getInfo } from '../api/manager'
import router from '../router'
import { strToUpCam } from '../composables/util'

const store = createStore({
    state() {
        return {
            user: {},
            menus: [],
            routesLoaded: false,
            activeMenu: '/',
            tagList: [{
                path: '/',
                label: '后台首页'
            }],
            activeTag: {
                index: 0,
                path: '/',
                label: '后台首页'
            }
        }
    },
    mutations: {
        updateActiveTag(state, activeTag) {
            state.activeTag = {
                index: activeTag.index,
                path: activeTag.path,
                label: activeTag.label
            }
            state.activeMenu = activeTag.path
            router.push(state.activeMenu)
        },
        addOrUpdateTag(state, tag) {
            const oldTag = state.tagList.find(item => item.path == tag.path);
            let index = state.activeTag.index
            if (!oldTag) {
                state.tagList.push(tag)
                state.activeTag = {
                    index: state.tagList.length - 1,
                    label: tag.label,
                    path: tag.path,
                }
            } else {
                index = state.tagList.indexOf(oldTag)
            }
            this.commit('updateActiveTag', {
                index,
                label: tag.label,
                path: tag.path
            })
        },
        removeTag(state, index) {
            if (index > 0) {
                state.tagList.splice(index, 1)
                this.commit('updateActiveTag', {
                    index: index - 1,
                    label: state.tagList[index - 1].label,
                    path: state.tagList[index - 1].path
                })
            }
        },
        removeAllTags(state) {
            state.tagList.splice(1)
            this.commit('updateActiveTag', {
                index: 0,
                label: '后台首页',
                path: '/'
            })

        },
        removeOtherTags(state) {
            if (state.activeMenu == '/') {
                this.commit('removeAllTags')
            } else {
                state.tagList.splice(1)
                const activeTag = state.activeTag
                state.tagList.push(activeTag)
                this.commit('updateActiveTag', {
                    index: 1,
                    label: activeTag.label,
                    path: activeTag.path
                })
            }
        },
        setMenus(state, menus) {
            state.menus = menus
        },
        setActiveMenu(state, path) {
            state.activeMenu = path
        },
        setRoutesLoaded(state) {
            state.routesLoaded = true
        },
        setUserInfo(state, user) {
            state.user = user
            // add routers
            const menus = user.menus
            menus.forEach(menu => {
                const subMenus = menu.child
                subMenus.filter(subMenu => subMenu.frontpath != "/").forEach(subMenu => {
                    router.addRoute(
                        'index',
                        {
                            path: subMenu.frontpath,
                            component: () => import(`../pages/${strToUpCam(subMenu.frontpath)}.vue`)
                        }
                    )
                })

            })
            router.addRoute(
                'index',
                {
                    path: '/',
                    component: () => import('../pages/Dashboard.vue')
                }
            )
        },
    },
    getters: {
        userDetail(state) {
            return state.user
        },
        menus(state) {
            return state.user.menus
        },
        getTagLabel: (state) => (path) => {
            return state.menus.find(item => item.frontpath == path)
        }
    },
    actions: {
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit('setUserInfo', res)
                    commit('setRoutesLoaded')
                    const menuList = res.menus.flatMap(menu => menu.child)
                    commit('setMenus', menuList)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})

export default store