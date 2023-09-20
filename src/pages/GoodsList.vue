<template>
    <el-tabs v-model="activeName" @tab-change="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="审核中" name="checking"></el-tab-pane>
        <el-tab-pane label="出售中" name="saling"></el-tab-pane>
        <el-tab-pane label="已下架" name="off"></el-tab-pane>
        <el-tab-pane label="库存预警" name="min_stock"></el-tab-pane>
        <el-tab-pane label="回收站" name="delete"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="relative m-auto h-full">
        <el-form class="mb-3">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="商品名称">
                        <el-input v-model="goodsName" placeholder="商品名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item v-show="showGoodsCategory" label="商品分类">
                        <el-select v-model="goodsCategory" placeholder="请选择商品分类" size="default">
                            <el-option v-for="item in goodsCategorys" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" style="display: flex; align-items: center; justify-content: flex-end;">
                    <el-button type="success" @click="queryGoodsList">搜索</el-button>
                    <el-button type="primary">重置</el-button>
                    <el-button type="primary" text v-if="showGoodsCategory" :icon="ArrowUp" @click="changeGoodsCategory">
                        收起
                    </el-button>
                    <el-button type="primary" text :icon="ArrowDown" v-else @click="changeGoodsCategory">
                        展开
                    </el-button>
                </el-col>
            </el-row>
        </el-form>

        <div class="flex items-center mb-4">
            <el-button type="primary">新增</el-button>
            <el-button type="danger">批量删除</el-button>
            <el-button plain>上架</el-button>
            <el-button plain>下架</el-button>
            <el-link type="default" style="margin-left: auto;"><el-icon>
                    <Refresh />
                </el-icon></el-link>
        </div>

        <el-table :data="tableData" table-layout="auto" stripe row-key="id" lazy empty-text="未查询到数据">
            <el-table-column prop="id" type="selection" />
            <el-table-column label="商品" align="left">
                <template #default="{ row }">
                    <div class="flex flex-row justify-start items-center gap-1">
                        <el-image class="w-20 h-20" :src="row.cover" fit="cover" />
                        <div
                            style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center;">
                            <span>{{ row.title }}</span>
                            <span>
                                <span style="color: red;">¥{{ row.min_price }}</span>
                                <el-divider direction="vertical" />
                                <span>¥{{ row.min_oprice }}</span>
                            </span>
                            <span>分类: {{ row.category?.name }}</span>
                            <span>创建时间{{ row.create_time }}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sale_count" label="实际销量" align="center" />
            <el-table-column label="商品状态" align="center">
                <template #default="{ row }">
                    <el-tag v-show="row.status == 1" type="success">上架</el-tag>
                    <el-tag v-show="row.status == 0" type="danger">仓库</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="审核状态" align="center">
                <template #default="{ row }">
                    <el-tag v-show="row.ischeck == 2" type="info">禁用</el-tag>
                    <el-tag v-show="row.ischeck == 1" type="success">通过</el-tag>
                    <el-tag v-show="row.ischeck == 0" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="总库存" align="center" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                        <el-button size="small" type="primary" @click="changeGoods(row)">修改</el-button>
                        <el-button size="small" type="primary" @click="showSkuDrawer(row)">商品规格</el-button>
                        <el-button size="small" type="primary">设置轮播图</el-button>
                        <el-button size="small" type="primary">商品详情</el-button>
                        <el-button size="small" type="danger">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex mt-4 mb-12 items-center justify-center">
            <el-pagination background v-model:current-page="currentPage" layout="prev, pager, next" :total="totalSize"
                :page-size="pageSize" @current-change="handleCurrentPageChange" />
        </div>
    </el-card>

    <el-drawer v-model="showDrawer" direction="rtl" class="z-1000">
        <template #header>
            <h4>修改</h4>
        </template>

        <template #default>
            <el-form :model="changeRow" label-position="right" label-width="120px">
                <el-form-item label="商品名称">
                    <el-input v-model="changeRow.title" />
                </el-form-item>
                <el-form-item label="封面">
                    <div class="flex gap-2 flex-row items-center justify-start">
                        <el-image class="w-20 h-20 rounded" :src="changeRow.cover" fit="cover" />
                        <el-button plain class="w-20 h-20 cursor-pointer">
                            <el-icon class="flex items-center justify-center">
                                <Plus />
                            </el-icon>
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="changeRow.category_id" placeholder="请选择商品分类" size="default">
                        <el-option v-for="    item     in     goodsCategorys    " :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="changeRow.desc" type="textarea" />
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="changeRow.unit" />
                </el-form-item>
                <el-form-item label="总库存">
                    <el-input v-model="changeRow.stock">
                        <template #append>{{ changeRow.unit }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存预警">
                    <el-input v-model="changeRow.min_stock">
                        <template #append>{{ changeRow.unit }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低销售价">
                    <el-input v-model="changeRow.min_price">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低原价">
                    <el-input v-model="changeRow.min_oprice">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存显示">
                    <el-radio-group v-model="changeRow.stock_display">
                        <el-radio :label=1 size="large" border>是</el-radio>
                        <el-radio :label=0 size="large" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="changeRow.status">
                        <el-radio :label=0 size="large" border>放入仓库</el-radio>
                        <el-radio :label=1 size="large" border>立即上架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template>

        <template #footer>
            <div class="flex items-start">
                <el-button type="primary" @click.prevent="confirmClick" :loading="loadingConfirm">
                    <template #loading>
                        <el-icon>
                            <Loading />
                        </el-icon>
                    </template>
                    提交</el-button>
                <el-button @click.prevent="cancelClick">取消</el-button>
            </div>
        </template>
    </el-drawer>

    <el-drawer v-model="showDrawer1" direction="rtl" :z-index=1000 size="70%">
        <template #header>
            <h4>设置商品规格</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="规格类型">
                    <el-radio-group v-model="changeRow.sku_type">
                        <el-radio :label=0 size="large" border>单规格</el-radio>
                        <el-radio :label=1 size="large" border>多规格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="添加规格">
                    <SkuCard :data="changeRow.goods_skus_card" />
                </el-form-item>
                <el-form-item label="规格设置">

                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div class="flex items-start">
                <el-button type="primary" @click.prevent="confirmSkuClick" :loading="loadingSkuConfirm">
                    <template #loading>
                        <el-icon>
                            <Loading />
                        </el-icon>
                    </template>
                    提交</el-button>
                <el-button @click.prevent="cancelClick">取消</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, onBeforeMount, } from 'vue'
import { ArrowDown, ArrowUp, Refresh, Plus, Loading } from '@element-plus/icons-vue'
import { queryGoods, updateGoods } from '../api/manager.js'
import SkuCard from '../components/SkuCard.vue'

const pageSize = ref( 5 )
const goodsCategorys = ref()
const totalSize = ref( 0 )
const currentPage = ref( 1 )

const goodsName = ref( null )
const goodsCategory = ref( null )
const showGoodsCategory = ref( false )

const tableData = ref()

const activeName = ref( 'all' )
const handleClick = () => {
    queryGoods( { tab: activeName.value } ).then( res => {
        totalSize.value = res.totalCount
        tableData.value = res.list
    } )
}
const changeGoodsCategory = () => {
    showGoodsCategory.value = !showGoodsCategory.value
}

const handleCurrentPageChange = () => {
    queryGoods( { tab: activeName.value, page: currentPage.value } ).then( res => {
        totalSize.value = res.totalCount
        tableData.value = res.list
    } )
}

const queryGoodsList = () => {
    let query = {
        tab: activeName.value,
        page: currentPage.value
    }

    if ( goodsName.value != null && goodsName.value.length > 0 ) {
        query.title = goodsName.value
    }

    if ( goodsCategory.value != null && showGoodsCategory.value ) {
        query.category_id = goodsCategory.value
    }


    queryGoods( query ).then( res => {
        totalSize.value = res.totalCount
        tableData.value = res.list
    } )
}
const changeRow = ref()
const showDrawer = ref( false )
const changeGoods = ( row ) => {
    if ( !showDrawer.value ) {
        showDrawer.value = true
        changeRow.value = row
    }
}
const cancelClick = () => {
    showDrawer.value = false
    showDrawer1.value = false
}
const loadingConfirm = ref( false )
const confirmClick = () => {
    showDrawer.value = false
    loadingConfirm.value = true
    let changeRowVal = changeRow.value
    const obj = {
        id: changeRowVal.id,
        title: changeRowVal.title,
        category_id: changeRowVal.category_id,
        cover: changeRowVal.cover,
        desc: changeRowVal.desc,
        unit: changeRowVal.unit,
        stock: changeRowVal.stock,
        min_stock: changeRowVal.min_stock,
        status: changeRowVal.status,
        stock_display: changeRowVal.stock_display,
        min_price: changeRowVal.min_price,
        min_oprice: changeRowVal.min_oprice,
        content: "",
    }
    updateGoods( obj ).finally( () => {
        loadingConfirm.value = false
    } )
}

const showDrawer1 = ref( false )
const showSkuDrawer = ( row ) => {
    if ( !showDrawer1.value ) {
        showDrawer1.value = true
        changeRow.value = row
    }
}

// change goods' sku
const confirmSkuClick = () => {

}

onBeforeMount( () => {
    queryGoods( { tab: activeName.value } ).then( res => {
        totalSize.value = res.totalCount
        goodsCategorys.value = res.cates.map( item => {
            return {
                label: item.name,
                value: item.id
            }
        } )

        tableData.value = res.list

    } )
} )

</script>