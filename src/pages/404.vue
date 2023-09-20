<template>
    <div class="f-404">
        <el-col :sm="12" :lg="6">
            <el-result icon="warning" title="404" sub-title="Page Not Found">
                <template #extra>
                    <el-button type="primary" @click="backToHome">返回首页</el-button>
                </template>
            </el-result>
        </el-col>
    </div>
</template>

<script>
export default {
    methods: {
        backToHome() {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.f-404 {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>