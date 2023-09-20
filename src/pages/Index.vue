<template>
    <el-container direction="vertical">
        <el-header>
            <template #default>
                <Header @collapse-event="collapse" />
            </template>
        </el-header>
        <el-container direction="horizontal">
            <el-aside width="250px">
                <template #default>
                    <Menu :isCollapse="isCollapse" :menus="store.state.user.menus" />
                </template>
            </el-aside>
            <el-main>
                <template #default>
                    <Main :isCollapse="isCollapse" />
                </template>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
import { ref } from 'vue'
import Main from '../components/Main.vue'
import { useStore } from 'vuex'
const store = useStore()
const isCollapse = ref(false)

function collapse(f) {
    isCollapse.value = f
}

</script>