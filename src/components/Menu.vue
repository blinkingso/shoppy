<template>
    <el-scrollbar class="f-menu">
        <el-menu :default-active="store.state.activeMenu" class="el-menu--vertical" :collapse="props.isCollapse" router
            unique-opened>
            <el-menu-item>
                <el-icon>
                    <VideoCamera />
                </el-icon>
                <template #title>前往前端网站</template>
            </el-menu-item>

            <el-sub-menu :index="item.name" v-for="item in store.state.user.menus" :key="item.order">
                <template #title>
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <el-menu-item :index="sub.frontpath" v-for="sub in item.child" :key="sub.order"
                    @click="activeTag(sub.frontpath, sub.name)">
                    <el-icon>
                        <component :is="sub.icon"></component>
                    </el-icon>
                    {{ sub.name }}
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-scrollbar>
</template>

<script setup>
import { VideoCamera } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
const store = useStore()

const props = defineProps({
    isCollapse: {
        type: Boolean,
        default: false,
    },
    menus: {
        type: Array,
        required: true,
        default: []
    }
})
const activeTag = (path, name) => {
    store.commit('addOrUpdateTag', { label: name, path })
}
</script>

<style scoped>
.f-menu {
    @apply fixed left-0 top-64px bottom-0 overflow-auto z-60 shadow-gray-300 shadow bg-light-50
}

.el-menu--vertical:not(.el-menu--collapse) {
    width: 250px;
}
</style>