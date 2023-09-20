import App from './App.vue'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as Vue3HotKey from 'vue3-shortkey'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(Vue3HotKey)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import './permission.js'
import 'normalize.css/normalize.css'
import 'virtual:windi.css'

app.mount('#app')
