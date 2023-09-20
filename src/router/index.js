import { createRouter, createWebHashHistory } from 'vue-router'

import Index from '../pages/Index.vue'
import NotFound from '../pages/404.vue'
import Login from '../pages/Login.vue'

const routes = [{
    path: "/",
    name: 'index',
    component: Index
}, {
    path: "/login",
    name: 'login',
    component: Login,

}, {
    path: '/:pathMatch(.*)*',
    name: '404',
    hidden: true,
    component: NotFound
}
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})


export default router