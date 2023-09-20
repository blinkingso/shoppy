<template>
    <div class="container">
        <el-row :gutter="gutter1">
            <el-col :span="6" v-for="(item, index) in statistics1Ref" :key="index">
                <el-card class="box-card" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>{{ item.title }}</span>
                            <el-tag class="ml-2" effect="plain" :type="item.unitColor">{{ item.unit }}</el-tag>
                        </div>
                    </template>
                    <div class="statistic-number">{{ Math.round(item.value) }}</div>
                    <el-divider />
                    <div class="statistic-bottom">
                        <div>{{ item.subTitle }}</div>
                        <div>{{ item.subValue }}{{ item.subUnit }}</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/user/list')">
                    <div class="icon-card-body">
                        <el-icon :size="20" color="green">
                            <User />
                        </el-icon>
                        <div>用户</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/goods/list')">
                    <div class="icon-card-body">
                        <el-icon :size="20" color="purple">
                            <ShoppingCart />
                        </el-icon>
                        <div>商品</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/order/list')">
                    <div class="icon-card-body">
                        <el-icon :size="20" color="purple">
                            <Document />
                        </el-icon>
                        <div>订单</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/comment/list')">
                    <div class="icon-card-body">
                        <el-icon color="green">
                            <ChatDotSquare />
                        </el-icon>
                        <div>评价</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/image/list')">
                    <div class="icon-card-body">
                        <el-icon color="red">
                            <Picture />
                        </el-icon>
                        <div>图库</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/notice/list')">
                    <div class="icon-card-body">
                        <el-icon color="green">
                            <Bell />
                        </el-icon>
                        <div>公告</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/setting/base')">
                    <div class="icon-card-body">
                        <el-icon>
                            <SetUp />
                        </el-icon>
                        <div>配置</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3">
                <el-card shadow="hover" @click="goToRouter('/coupon/list')">
                    <div class="icon-card-body">
                        <el-icon color="orange">
                            <Suitcase />
                        </el-icon>
                        <div>优惠券</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>订单统计</span>
                            <div class="check-tag-list">
                                <el-radio-group v-model="statisticsType" size="large" @change="changeStatistics3">
                                    <el-radio-button label="month">
                                        <template #default>
                                            近1个月
                                        </template>
                                    </el-radio-button>
                                    <el-radio-button label="week">
                                        <template #default>
                                            近1周
                                        </template>
                                    </el-radio-button>
                                    <el-radio-button label="hour">
                                        <template #default>
                                            近24小时
                                        </template>
                                    </el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                    </template>
                    <v-chart class="chart" :option="option" autoresize />
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card style="margin-bottom: 10px;">
                    <template #header>
                        <div class="card-header">
                            <span>店铺及商品提示</span>
                            <el-tag effect="plain" type="danger">商铺及商品提示</el-tag>
                        </div>
                    </template>
                    <el-row :gutter="24">
                        <el-col :span="6" v-for="(item, index) in statistics2Ref.goods" :key="index">
                            <el-card shadow="hover" class="bg-light-400">
                                <div class="icon-card-body">
                                    <div>{{ item.value }}</div>
                                    <div>{{ item.label }}</div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>交易提示</span>
                            <el-tag effect="plain" type="danger">需要立即处理的交易订单</el-tag>
                        </div>
                    </template>
                    <el-row :gutter="24">
                        <el-col :span="6" v-for="( item, index) in statistics2Ref.order" :key="index">
                            <el-card shadow="hover" class="bg-light-400">
                                <div class="icon-card-body">
                                    <div>{{ item.value }}</div>
                                    <div>{{ item.label }}</div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { User, Document, ChatDotSquare, Picture, Bell, SetUp, Suitcase } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { statistics1, statistics2, statistics3 } from '../api/manager.js'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

use([GridComponent, BarChart, CanvasRenderer])
const router = useRouter()
const store = useStore()

const statistics1Ref = ref([])
const statistics2Ref = ref([])
const gutter1 = computed(() => {
    if (statistics1Ref.value) {
        return statistics1Ref.value.length * 6
    } else {
        return 24
    }
})

const goToRouter = (path) => {
    store.commit('addOrUpdateTag', {
        label: store.state.menus.find(item => item.frontpath == path).name,
        path
    })
}
const statisticsType = ref('month')
const option = ref({
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }
    ]
})
const changeStatistics3 = () => {
    statistics3(statisticsType.value).then(res => {
        option.value.xAxis.data = res.x
        option.value.series[0].data = res.y
    })
}

onMounted(() => {
    statistics1().then(res => {
        statistics1Ref.value = res.panels
    })
    statistics2().then(res => {
        statistics2Ref.value = res
    })

    statistics3(statisticsType.value).then(res => {
        option.value.xAxis.data = res.x
        option.value.series[0].data = res.y
    })
})


</script>

<style scoped lang="less">
.container {
    margin: 10px 10px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .statistic-number {
        font-size: 2rem;
        font-weight: bold;
    }

    .statistic-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .el-row {
        margin: 10px;
    }

    .icon-card-body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        cursor: pointer;
    }

    .check-tag-list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.25rem;
    }

    .store-good-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .chart {
        height: 400px;
        width: 100%;
    }

    .bg-light-400 {
        background-color: rgba(246, 246, 246, 1)
    }
}
</style>