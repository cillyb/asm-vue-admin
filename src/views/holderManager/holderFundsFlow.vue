<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            用户名:<el-input v-model="condition.userName" style="width: 10%;"></el-input>
            手机号(后台暂不支持):<el-input v-model="condition.phoneNumber" style="width: 10%;"></el-input>
            订单编号(后台暂不支持):<el-input v-model="condition.orderNo" style="width: 10%;"></el-input>
            设备编号(后台暂不支持):<el-input v-model="condition.deviceNo" style="width: 10%;"></el-input>
            <el-button type="primary" v-on:click="handleQuery">查询</el-button>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="flows"
                  highlight-current-row
                  v-loading="listLoading"
                  @selection-change="selsChange"
                  row-key="id"
                  style="width: 100%;">
            <el-table-column type="index" label="序号" style="width: 10%;">
            </el-table-column>
            <el-table-column prop="userName" label="用户名" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="assetName" label="设备名" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="shareholdingPercent" label="分利比" :formatter="formatPercent" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="capitalFlowType" label="流水类型" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="accountDate" label="结账日" :formatter="formatDate" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="moneyChange" label="该单收益" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="totalShareBenefit" label="总收益" style="width: 20%;" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" style="width: 20%;" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" style="width: 20%;" sortable>
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
    import { getHolderCapitalFlow } from '../../api/holderApi';
    import util from '../../common/js/util';

    export default {
        data() {
            return {
                condition: {
                    userName:'',
                    orderNo:'',
                    phoneNumber:'',
                    deviceNo:''
                },
                flows: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
            }
        },
        methods: {

            //百分比显示格式转化
            formatPercent: function (row, column) {
                if(row.shareholdingPercent != null) {
                    return row.shareholdingPercent+"%";
                }
            },
            //每月结算日格式转化
            formatDate: function (row, colum) {
                return "每月"+row.accountDate+"号";
            },

            handleSizeChange(val) {
                this.size = val;
                this.getHolderCapitalFlow();
            },
            handleQuery(){
                this.current = 1;
                this.getHolderCapitalFlow();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getHolderCapitalFlow();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //获取持有人列表
            getHolderCapitalFlow() {
                let para = {
                    "page":{
                        "current":this.page,
                        "size":this.size
                    },
                    "condition": this.condition
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getHolderCapitalFlow(para).then((res) => {
                    this.total = res.data.total;
                    this.flows = res.data.records;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getHolderCapitalFlow();
        }
    }

</script>

<style scoped>

</style>