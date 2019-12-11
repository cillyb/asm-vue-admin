<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            设备编号:<el-input v-model="condition.deviceNo" clearable style="width: 10%;"></el-input>
            所属社区:<el-input v-model="condition.communityName" clearable style="width: 10%;"></el-input>
            上下架状态:
            <el-select v-model="condition.status" clearable style="width: 10%">
                <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            设备状态:
            <el-select v-model="condition.runningCondition" clearable style="width: 10%">
                <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" v-on:click="handleQuery">查询</el-button>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="monitor" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" label="序号" style="width: 10%;">
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="assetName" label="设备名称" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="typeName" label="设备种类" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="communityName" label="所属社区" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="runningCondition" label="设备状态" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="status" label="上下架" style="width: 15%;" sortable>
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            @change=changeSwitchStatus(scope.row)>
                    </el-switch>
                </template>
            </el-table-column>
<!--            <el-table-column prop="isCanBook" label="预约设置" style="width: 15%;" sortable>-->
<!--                <template scope="scope">-->
<!--                    <el-switch-->
<!--                            v-model="scope.row.isCanBook"-->
<!--                            active-color="#13ce66"-->
<!--                            inactive-color="#ff4949"-->
<!--                            :active-value="1"-->
<!--                            :inactive-value="0"-->
<!--                            @change=changeSwitchBook(scope.row)>-->
<!--                    </el-switch>-->
<!--                </template>-->
<!--            </el-table-column>-->
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import { getMonitorListPage, openStatus, closeStatus, openIsCanBook, closeIsCanBook } from '../../api/monitorApi';
    import util from '../../common/js/util';

    export default {
        data() {
            return {
                condition: {
                    deviceNo:'',
                    status:'',
                    communityName:'',
                    runningCondition:''
                },
                options1:[
                    {
                        value: '1',
                        label:'上架中'
                    },
                    {
                        value: '-1',
                        label:'下架中'
                    },
                ],
                options2:[
                    {
                        value: '忙碌',
                        label:'忙碌'
                    },
                    {
                        value: '空闲',
                        label:'空闲'
                    },
                ],
                monitor: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
            }
        },
        methods: {

            handleSizeChange(val) {
                this.size = val;
                this.getMonitor();
            },
            handleQuery(){
                this.current = 1;
                this.getMonitor();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getMonitor();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

            //switch按钮点击触发事件，日后方便对上下架状态进行修改
            changeSwitchStatus(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openStatus(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '设备已上架',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }else{
                    closeStatus(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '设备已下架',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },

            //switch按钮点击触发事件，日后方便对预约开启与关闭进行修改
            changeSwitchBook(row){
                let para = {
                    ids: [row.id]
                }
                if(row.isCanBook == 1){
                    openIsCanBook(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '预约已开启',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }else{
                    closeIsCanBook(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '预约已关闭',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },

            //获取持有人列表
            getMonitor() {
                let para = {
                    "page":{
                        "current":this.page,
                        "size":this.size
                    },
                    "condition": this.condition
                };
                para.condition = util.filterParams(para.condition);
                if(para.condition.status == -1) {
                    para.condition.status = 0;
                }
                this.listLoading = true;
                getMonitorListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.monitor = res.data.records;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getMonitor();
        }
    }

</script>

<style scoped>

</style>