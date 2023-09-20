<template>
    <div class="container">
        <div class="left">
            <div class="header">
                欢迎光临
            </div>
            <div class="desc">
                此站点是《Vue3实战商城后台管理系统开发》视频课程的演示地址, <el-link style="color: white; font-weight: bold;" type="success"
                    href="#">点击立即学习</el-link>
            </div>
        </div>
        <div class="right">
            <div style="color: black; font-weight: bold; font-size: 1.5rem;">欢迎回来</div>
            <div class="span">
                <span class="line"></span>
                <span>用户账号登录</span>
                <span class="line"></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="user">
                <el-form-item class="item" prop="username">
                    <el-input placeholder="请输入用户名" v-model="user.username" autofocus>
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item class="item" prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="user.password">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item class="item">
                    <el-button type="primary" @click="onSubmit()" :loading="loading" v-shortkey='["enter"]'
                        @shortkey="onSubmit()" style="width: 100%;" round>
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { toast } from '../composables/util'
import { setToken } from '../composables/auth'
import { login } from '../api/manager'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const rules = reactive({
    username: [{
        required: true,
        message: '用户名不能为空',
        trigger: 'blur'
    }, {
        min: 3,
        max: 12,
        message: '用户名在2-12个字符',
        trigger: 'blur'
    }],
    password: [{
        required: true,
        message: "密码不能为空",
        trigger: 'blur'
    }]
})
const user = reactive({
    username: "",
    password: "",
})
const formRef = ref('formRef')
const router = useRouter()

const loading = ref(false)

const onSubmit = () => {
    // login logic.
    formRef.value.validate((valid) => {
        if (!valid) {
            return
        }
        loading.value = true
        login(user.username, user.password)
            .then((res) => {
                toast("登录成功")
                router.push('/')
                setToken(res.token)
            })
            .finally(() => {
                loading.value = false
            })
    })
}

onMounted(() => {
    const logout = history.state.showToast
    if (!!logout) {
        toast('登出成功')
        history.replaceState(logout, '')
    }
})
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
}

.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
}

.container .left {
    width: 70%;
    height: 100%;
    background-color: rgb(99, 102, 241);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.container .right {
    width: 30%;
    height: 100%;
    background-color: rgb(253, 253, 253);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgb(209, 213, 219);
}

.container .right>* {
    margin-top: 0.5rem;
}

.span {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.span>* {
    margin-right: 0.5rem;
}

.container .line {
    width: 80px;
    height: 1px;
    background-color: rgb(229, 231, 235);
}

.header {
    font-size: 3rem;
    color: white;
    font-weight: bold;
    margin-bottom: 1rem;
}

.item {
    width: 100%;
    margin-top: 1rem;
}

.desc {
    width: 20rem;
    color: white;
    font-size: 1rem;
}

.desc a {
    font-size: 1rem;
}

@media screen and (max-width: 1280px) {
    .container {
        flex-direction: row;
    }

    .container .left {
        width: 50%;
    }

    .container .right {
        width: 50%;
    }
}

@media screen and (max-width: 768px) {
    .container {
        flex-direction: column;
    }

    .container .left {
        width: 100%;
        height: 60%;
    }

    .container .right {
        width: 100%;
        height: 40%;
    }
}
</style>