<template>
    <div class="f-header">
        <el-link :underline="false" class="logo">
            <el-icon>
                <Shop />
            </el-icon>购物平台
        </el-link>
        <el-icon class="icon-btn" v-show="collapse" @click="changeCollapse">
            <Expand />
        </el-icon>
        <el-icon class="icon-btn" v-show="!collapse" @click="changeCollapse">
            <Fold />
        </el-icon>
        <el-tooltip class="box-item" content="刷新">
            <el-icon class="icon-btn" @click="refresh">
                <Refresh />
            </el-icon>
        </el-tooltip>


        <div class="ml-auto flex">
            <el-tooltip content="视频教程">
                <el-icon class="icon-btn">
                    <VideoCamera />
                </el-icon>
            </el-tooltip>
            <el-tooltip v-if="!fullScreen" effect="dark" content="全屏">
                <el-icon class="icon-btn" @click="toggleFullScreen">
                    <FullScreen />
                </el-icon>
            </el-tooltip>
            <el-tooltip v-else="fullScreen" effect="dark" content="退出全屏">
                <el-icon class="icon-btn" @click="toggleFullScreen">
                    <Aim />
                </el-icon>
            </el-tooltip>

            <el-dropdown class="dropdown">
                <span class="flex items-center content-center text-light-50 gap-1">
                    <el-avatar :size="20" :src="store.state.user.avatar" />
                    {{ store.state.user.username }}
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="showModifyPassword = true">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="showLogout = true">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <div class="el-overlay" :style="{ 'z-index': computedZIndex, 'display': displayOverlay }">
        <el-drawer ref="passwordDrawerRef" v-model="showModifyPassword" title="修改密码" direction="rtl" size="50%">
            <el-form ref="passwordModifyFormRef" :model="passForm" :rules="passwordModifyFormRule" label-width="auto"
                label-position="left">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="passForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="passForm.confirmPassword"></el-input>
                </el-form-item>

                <el-button type="primary" @click.prevent="onModifyPassword(passwordModifyFormRef)">提交</el-button>
                <el-button @click="cancelModifyPassword(passwordModifyFormRef)">取消</el-button>
            </el-form>
        </el-drawer>
        <el-dialog v-model="showLogout" title="提示" width="30%">
            <span style="display: flex; justify-content: flex-start; align-items:  center;">
                <el-icon :size="20" color="#E6A23C">
                    <Warning />
                </el-icon>
                是否要退出登录
            </span>
            <template #footer>
                <span>
                    <el-button @click="showLogout = false">取消</el-button>
                    <el-button type="primary" @click="logout">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { Expand, Fold, Refresh, VideoCamera, FullScreen, ArrowDown, Warning, Aim } from '@element-plus/icons-vue'
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { updatePassword } from '../api/manager.js'
import { removeToken } from '../composables/auth.js'
const store = useStore()

// control to show/hidden modify password template
const showModifyPassword = ref(false)
// control to show/hidden logout template
const showLogout = ref(false)

const computedZIndex = computed(() => {
    if (showLogout.value === true) {
        return 2031
    } else {
        return 2028
    }
})

const displayOverlay = computed(() => {
    if (showModifyPassword.value !== true && showLogout.value !== true) {
        return 'none'
    }
})

const emit = defineEmits(['collapse-event'])

// controll menu to expand or fold
const collapse = ref(false)
function changeCollapse() {
    collapse.value = !collapse.value
    emit('collapse-event', collapse.value)
}

onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            toggleFullScreen()
        }
    })
})
const fullScreen = ref(false)
const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        fullScreen.value = true
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
            fullScreen.value = false
        }
    }
}

const router = useRouter()
const refresh = () => {
    router.go(0)
}

const passwordModifyFormRef = ref()
const passwordModifyFormRule = reactive({
    oldPassword: [{
        required: true,
        message: '旧密码必填',
        trigger: 'blur'
    }, {
        min: 5,
        max: 16,
        trigger: 'blur',
        message: '密码长度在5-16个字符'
    }],
    newPassword: [{
        required: true,
        message: '新密码必填',
        trigger: 'blur'
    }, {
        min: 5,
        max: 16,
        trigger: 'blur',
        message: '密码长度在5-16个字符'
    }],
    confirmPassword: [{
        required: true,
        message: '确认密码必填',
        trigger: 'blur'
    }, {
        min: 5,
        max: 16,
        trigger: 'blur',
        message: '密码长度在5-16个字符'
    }]
})

const passForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// modify user password
const onModifyPassword = async (formRef) => {
    if (!formRef) {
        return
    }

    await formRef.validate((valid) => {
        if (valid) {
            updatePassword(passForm.oldPassword, passForm.newPassword, passForm.confirmPassword)
        }
    })
}

const passwordDrawerRef = ref()
const cancelModifyPassword = (ele) => {
    if (ele) {
        ele.resetFields()

        if (passwordDrawerRef) [
            passwordDrawerRef.value.close()
        ]
    }
}

const logout = () => {
    removeToken()
    // redirect to login page
    router.push({
        name: 'login',
        state: {
            showToast: true,
        }
    })
}

</script>

<style scoped>
.f-header {
    @apply flex fixed top-0 left-0 right-0 items-center z-60 h-64px box-border bg-indigo-700
}

.icon-btn {
    @apply h-64px w-42px flex items-center content-center cursor-pointer text-light-50
}

.icon-btn:hover {
    @apply bg-indigo-600
}

.logo {
    @apply flex w-250px color text-light-50 text-xl leading-7 items-center content-center
}

.dropdown {
    @apply flex flex-row items-center content-center mx-20px my-auto cursor-pointer
}

.el-overlay {
    @apply fixed inset-0 overflow-auto bg-black bg-opacity-5 h-full w-full
}
</style>