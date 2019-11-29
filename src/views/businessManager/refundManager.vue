<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.id" placeholder="退款编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleQuery">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="refund" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" label="序号">
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" sortable>
            </el-table-column>
            <el-table-column prop="id" label="退款编号" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="申请时间" sortable>
            </el-table-column>
            <el-table-column prop="assetName" label="设备名称" sortable>
            </el-table-column>
            <el-table-column prop="orderStatus" label="交易状态" sortable>
            </el-table-column>
            <el-table-column prop="reason" label="退款理由" sortable>
            </el-table-column>
            <el-table-column prop="price" label="支付金额" :formatter="formatPrice" sortable>
            </el-table-column>
            <el-table-column prop="refundMoney" label="退款金额" :formatter="formatRefundMoney" sortable>
            </el-table-column>
            <el-table-column prop="refundPercent" label="退款比例" :formatter="formatRefundPercent" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'

    import { getRefundListPage } from '../../api/businessApi';

    export default {
        data() {
            return {
                filters: {
                    id: ''
                },
                refund: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
            }
        },
        methods: {
            handleSizeChange(val) {
                this.size = val;
                this.getRefund();
            },
            handleQuery(){
                this.current = 1;
                this.getRefund();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRefund();
            },
            //支付金额格式转换
            formatPrice: function (row, column) {
                return row.price+"元";
            },
            //退款金额格式转换
            formatRefundMoney: function (row, column) {
                return row.refundMoney+"元";
            },
            //退款比例格式转换
            formatRefundPercent: function (row, column) {
                return row.refundPercent+"%";
            },
            //获取订单列表
            getRefund() {
                let para = {
                    page:{
                        current:this.page,
                        size:this.size
                    },
                    condition: this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getRefundListPage(para).then((res) => {
                    console.log(res)
                    this.total = res.data.total;
                    this.refund = res.data.records;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getRefund();
        }
    }

</script>

<style scoped>

</style>