<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            设备编号:<el-input v-model="condition.deviceNo" clearable style="width: 10%;"></el-input>
            手机号:<el-input v-model="condition.phoneNumber" clearable style="width: 10%;"></el-input>
            流水状态:
            <el-select v-model="condition.isSuccess" clearable style="width: 10%">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" v-on:click="handleQuery">查询</el-button>
            <el-button type="primary" v-on:click="downloadExcel">导出Excel</el-button>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="flows"
                  highlight-current-row
                  v-loading="listLoading"
                  @selection-change="handleSelectionChange"
                  row-key="id"
                  style="width: 100%;">
            <el-table-column type="selection" width="45">
            </el-table-column>
            <el-table-column prop="idx" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="assetName" label="设备名" style="width: 15%;" >
            </el-table-column>
<!--            <el-table-column prop="accountDate" label="结账日" :formatter="formatDate" style="width: 15%;" sortable>-->
<!--            </el-table-column>-->
            <el-table-column prop="moneyChange" label="持有人收益" :formatter="formatMoney2" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="accountDateBenefit" label="结账日前收益" :formatter="formatMoney3" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="isSuccess" label="流水状态" :formatter="formatStatus" style="width: 20%;" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="完成时间" style="width: 20%;" sortable>
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
                multipleSelection:[],
                options:[
                    {
                        value: '-1',
                        label:'未转账'
                    },
                    {
                        value: '1',
                        label:'已转账'
                    },
                ],
                condition: {
                    userName:'',
                    orderNo:'',
                    phoneNumber:'',
                    deviceNo:'',
                    isSuccess:''
                },
                flows: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
            }
        },
        methods: {
            handleSelectionChange (val) { // 操作多选
                this.multipleSelection = val; // 多选的行会存入multipleSelection数组中
            },
            // 列表下载
            downloadExcel () {
                if(this.multipleSelection.length == 0) {
                    this.$message({
                        message: "请勾选需要导出的订单!",
                        type: 'error'
                    });
                    return ;
                }
                this.$confirm('确定导出勾选的订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.multipleSelection; // multipleSelection是一个数组，存储表格中选择的行的数据。
                    this.export2Excel();
                }).catch(() => {

                });
            },
            // 数据写入excel
            export2Excel () {
                var that = this;
                require.ensure([], () => {
                    const { export_json_to_excel } = require('@/excel/export2Excel'); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
                    const tHeader = ['序号', '订单编号', '使用人手机', '设备编号', '设备名称', '结账日', '持有人收益', '结账日前收益', '流水状态', '完成时间']; // 导出的表头名信息
                    const filterVal = ['idx', 'orderNo', 'phoneNumber', 'deviceNo', 'assetName', 'accountDate', 'moneyChange', 'accountDateBenefit', 'isSuccessNew', 'createTime']; // 导出的表头字段名，需要导出表格字段名
                    const list = that.excelData;
                    const data = that.formatJson(filterVal, list);

                    export_json_to_excel(tHeader, data, '流水列表(导出时间:'+util.formatDate.getDateTime(new Date())+')');// 导出的表格名称，根据需要自己命名
                });
            },
            // 格式转换，直接复制即可
            formatJson (filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]));
            },

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
            formatStatus: function (row, colum) {
                return row.isSuccess == 0 ? "未转账" : "已转账";
            },
            formatMoney1: function (row, colum) {
                return row.price+"元";
            },
            formatMoney2: function (row, colum) {
                return row.moneyChange+"元";
            },
            formatMoney3: function (row, colum) {
                return row.accountDateBenefit+"元";
            },
            formatMoney4: function (row, colum) {
                return row.totalShareBenefit+"元";
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
                if(para.condition.isSuccess == -1) {
                    para.condition.isSuccess = 0;
                }
                this.listLoading = true;
                getHolderCapitalFlow(para).then((res) => {
                    this.total = res.data.total;
                    this.flows = res.data.records;
                    for(let i = 0; i < this.flows.length; i++) {
                        this.flows[i].idx = (this.page-1)*this.size+i+1;
                        this.flows[i].isSuccessNew = this.flows[i].isSuccess == 1 ? '已转账' : '未转账';
                    }
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