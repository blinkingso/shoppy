<template>
    <div class="f-tag-list" :class="{ collapse: props.isCollapse }">
        <div class="tag-list">
            <el-icon class="tag-btn" v-show="hideScroll" @click="transformLeft">
                <ArrowLeft />
            </el-icon>

            <div ref="tagLeft" class="tag-left text-gray bg-transparent">
                <span @click.stop="activeTag(item.path, item.name)" v-for="(item, index) in store.state.tagList"
                    class="tag-btn mr-2" closable :key='index' :class="{ 'tag-btn-active': isActive(item.path) }">
                    {{ item.label }}
                    <el-icon v-show="item.path != '/'" @click.stop="removeTag(index, item.path)">
                        <Close />
                    </el-icon>
                </span>
            </div>

            <el-icon class="tag-btn" v-show="hideScroll" @click="transformRight">
                <ArrowRight />
            </el-icon>
            <div class="tag-btn ml-auto">
                <el-dropdown>
                    <span>
                        <el-icon>
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="closeOtherTags()">关闭其他</el-dropdown-item>
                            <el-dropdown-item @click="closeAllTags()">全部关闭</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="h-4"></div>
        <el-scrollbar class="overflow-y-auto m-4 h-800px">
            <router-view></router-view>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUpdated, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const props = defineProps(['isCollapse'])

const isActive = (path) => {
    return path == store.state.activeTag.path
}

const activeTag = (path, name) => {
    store.commit('addOrUpdateTag', {
        path,
        label: name
    })
}

const removeTag = (index) => {
    store.commit('removeTag', index)
}

const scrollX = (target) => {
    const sW = target.scrollWidth
    return sW / tagLeft.value.children.length
}
const tagLeft = ref()
const cW = ref(0)
const sW = ref(0)
const hideScroll = computed(() => {
    return cW.value < sW.value
})
onUpdated(() => {
    getScWidth()
})
const getScWidth = () => {
    cW.value = tagLeft.value.clientWidth
    sW.value = tagLeft.value.scrollWidth
}
onMounted(() => {
    window.addEventListener('resize', () => {
        getScWidth()
    })

    const currentPath = router.currentRoute.value.fullPath
    if (store.state.activeTag.path != currentPath) {
        store.commit('addOrUpdateTag', {
            label: store.getters.getTagLabel(currentPath).name,
            path: currentPath,
        })
    }
})

const transformLeft = () => {
    tagLeft.value.scrollLeft += scrollX(tagLeft.value)
}
const transformRight = () => {
    tagLeft.value.scrollLeft -= scrollX(tagLeft.value)
}

const closeOtherTags = () => {
    store.commit('removeOtherTags')
}

const closeAllTags = () => {
    store.commit('removeAllTags')
}

</script>

<style scoped>
.f-tag-list {
    @apply fixed top-64px left-250px right-0 pl-2 pr-2 z-60
}

.tag-list {
    @apply flex content-center items-center bg-gray-100 z-100 gap-2 h-12
}

.hide {
    display: none !important;
}

.collapse {
    left: 64px;
}

.tag-left {
    display: flex;
    flex: 1 1 0%;
}

.tag-btn {
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    background-color: rgb(253, 253, 253);
    flex-shrink: 0;
}

.tag-btn-active {
    color: rgb(99, 102, 241);
}
</style>