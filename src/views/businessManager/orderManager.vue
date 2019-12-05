<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            &nbsp;&nbsp;下单日期:&nbsp;
            <el-date-picker type="date" placeholder="下单开始日期" v-model="condition.aimQueryDateBegin" value-format="yyyy-MM-dd" style="width:10%"></el-date-picker>
            &nbsp;-&nbsp;
            <el-date-picker type="date" placeholder="下单结束日期" v-model="condition.aimQueryDateEnd" value-format="yyyy-MM-dd" style="width:10%"></el-date-picker>

            &nbsp;&nbsp;预约日期:&nbsp;
            <el-date-picker type="date" placeholder="预约开始日期" v-model="condition.appointQueryDateBegin" value-format="yyyy-MM-dd" style="width:10%"></el-date-picker>
            &nbsp;-&nbsp;
            <el-date-picker type="date" placeholder="预约结束日期" v-model="condition.appointQueryDateEnd" value-format="yyyy-MM-dd" style="width:10%"></el-date-picker>
            <br><br>
            <el-input v-model="condition.orderNo" placeholder="订单编号" style="width: 8%" clearable></el-input>
            <el-input v-model="condition.communityName" placeholder="所属社区" style="width: 8%" clearable></el-input>
            <el-input v-model="condition.deviceNo" placeholder="设备编号" style="width: 8%" clearable></el-input>
            <el-input v-model="condition.phoneNumber" placeholder="使用人手机" style="width: 8%" clearable></el-input>
<!--            <el-input v-model="condition.orderNo" placeholder="订单状态" style="width: 8%"></el-input>-->
            <el-select v-model="condition.orderStatus" clearable placeholder="订单状态" style="width: 8%">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;<el-button type="primary" v-on:click="handleQuery">查询</el-button>
            &nbsp;&nbsp;<el-button type="primary" v-on:click="exportExcel">导出Excel</el-button>

        </el-col>

        <!--列表-->
        <el-table id="out-table" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="order" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" label="序号">
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="使用人手机">
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" sortable>
            </el-table-column>
            <el-table-column prop="price" label="支付金额" :formatter="formatPrice" sortable>
            </el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" sortable>
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" :formatter="formatNo" sortable>
            </el-table-column>
            <el-table-column prop="assetName" label="设备名称" sortable>
            </el-table-column>
            <el-table-column prop="communityName" label="所属社区" sortable>
            </el-table-column>
            <el-table-column prop="appointTimeStr" label="预约时间" sortable>
            </el-table-column>
            <el-table-column prop="realBeginTime" label="开始运行时间">
            </el-table-column>
            <el-table-column prop="realEndTime" label="结束运行时间">
            </el-table-column>
            <el-table-column prop="serverTotalTime" label="总运行时间" :formatter="formatMin"sortable>
            </el-table-column>
            <el-table-column prop="shareholdingMoney" label="持有人应得" :formatter="formatPrice2" sortable>
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
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    import { getOrderListPage } from '../../api/businessApi';

    export default {
        data() {
            return {
                options:[
                    {
                        value: '待付款',
                        label:'待付款'
                    },
                    {
                        value: '已预约',
                        label:'已预约'
                    },
                    {
                        value: '已完成',
                        label:'已完成'
                    },
                    {
                        value: '已退款',
                        label:'已退款'
                    },
                    {
                        value: '支付超时',
                        label:'支付超时'
                    },
                    {
                        value: '已使用',
                        label:'已使用'
                    },
                    {
                        value: '退款处理中',
                        label:'退款处理中'
                    },
                    {
                        value: '退款关闭',
                        label:'退款关闭'
                    },
                    {
                        value: '退款成功',
                        label:'退款成功'
                    },
                    {
                        value: '已取消',
                        label:'已取消'
                    },
                ],
                condition: {
                    orderNo: '',
                    aimQueryDateBegin:'',
                    aimQueryDateEnd:'',
                    appointQueryDateBegin:'',
                    appointQueryDateEnd:'',
                    orderNo:'',
                    companyName:'',
                    deviceNo:'',
                    phoneNumber:'',
                    orderStatus:''
                },
                order: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
            }
        },
        methods: {
            handleSizeChange(val) {
                this.size = val;
                this.getOrder();
            },
            handleQuery(){
                this.current = 1;
                this.getOrder();
            },
            //导出Excel
            exportExcel(){
                var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
                /* 从表生成工作簿对象 */
                var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'), xlsxParam);
                console.log(wb);
                /* 获取二进制字符串作为输出 */
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });

                var name = util.formatDate.getDateTime(new Date())+".xlsx";
                try {
                        FileSaver.saveAs(
                        //Blob 对象表示一个不可变、原始数据的类文件对象。
                        //Blob 表示的不一定是JavaScript原生格式的数据。
                        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                        new Blob([wbout], { type: "application/octet-stream" }),
                        //设置导出文件名称
                        name
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getOrder();
            },
            //支付金额格式转换
            formatPrice: function (row, column) {
                if(row.price != null) {
                    return row.price+"元";
                }
            },
            formatPrice2: function (row, column) {
                if(row.shareholdingMoney != null) {
                    return row.shareholdingMoney+"元";
                }
            },
            //设备编号添加No
            formatNo: function (row, column) {
                if(row.deviceNo != null) {
                    return "NO."+row.deviceNo;
                }
            },
            formatMin: function (row, column) {
                if(row.serverTotalTime != null) {
                    return row.serverTotalTime+"分钟";
                }
            },
            //获取订单列表
            getOrder() {
                let para = {
                    page:{
                        current:this.page,
                        size:this.size
                    },
                    condition: this.condition
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getOrderListPage(para).then((res) => {
                    console.log(res)
                    this.total = res.data.total;
                    this.order = res.data.records;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getOrder();
        }
    }

</script>

<style scoped>

</style>