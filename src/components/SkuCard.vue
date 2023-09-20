<template>
    <div class="sku-card" :key="item.order" v-for="item in props.data">
        <div class="header">
            <el-input v-model="item.name" class="w-50">
                <template #suffix>
                    <el-icon>
                        <MoreFilled />
                    </el-icon>
                </template>
            </el-input>
            <el-button class=" ml-auto" text>
                <el-icon color="#a0cfff">
                    <Top />
                </el-icon>
            </el-button>
            <el-button text>
                <el-icon color="#a0cfff">
                    <Bottom />
                </el-icon>
            </el-button>
            <el-button text>
                <el-icon color="#a0cfff">
                    <Delete />
                </el-icon>
            </el-button>
        </div>
        <div class="p-2">
            <div>
                <el-tag size="large" v-for="card in item.goods_skus_card_value" :key="tag" class="mx-1" closeable
                    :disable-transitions="false" @close="handleClose(card)">
                    <template #default>
                        <el-input size="small" :value="card.value" />
                        <el-icon>
                            <Close />
                        </el-icon>
                    </template>
                </el-tag>
                <el-input v-if="inputVisible(card)" class="ml-1 w-20" size="small" @keyup.enter="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="ml-1" size="small" @click="showInput">
                    + 添加值
                </el-button>
            </div>
        </div>
    </div>
    <el-button type="success">添加规格</el-button>
</template>

<script setup>
import { MoreFilled, Top, Bottom, Delete, Close } from '@element-plus/icons-vue'
const props = defineProps( [ "data" ] )

const handleClose = ( card ) => {
    console.log( card );
}
const inputVisible = ( item ) => {
    
}
const showInput = () => {

}
const handleInputConfirm = () => {

}
</script>

<style scoped>
.sku-card {
    border-radius: 0.25rem;
    border-width: 1px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 0.5rem;
    width: 100%;
}

.header {
    @apply flex items-center py-2 px-3 bg-gray-50
}
</style>