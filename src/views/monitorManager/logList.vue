<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            用户名:&nbsp;
            <el-input v-model="condition.userName" style="width:10%" maxlength="11"></el-input>
            <el-button type="primary" v-on:click="handleQuery">查询</el-button>
        </el-col>

        <!--列表-->
        <el-table :data="logs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" fit="true" style="width: 100%;">
            <!--            <el-table-column type="selection" >-->
            <!--            </el-table-column>-->
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column prop="userName" label="用户名" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" >
            </el-table-column>
            <el-table-column prop="logFromType" label="来源" sortable>
            </el-table-column>
            <el-table-column prop="logType" label="操作类型" sortable>
            </el-table-column>
            <el-table-column prop="aim" label="操作行为" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="操作时间" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    // import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import { getLogs } from '../../api/monitorApi'

    export default {
        data() {
            return {
                condition: {
                    userName:''
                },
                logs: [],
                total:0,
                size: 10,
                current: 1,
                listLoading: false,
                sels: [],//列表选中列


            }
        },
        methods: {
            handleSizeChange(val) {
                this.size = val;
                this.getLogs();
            },

            handleQuery(){
                this.current = 1;
                this.getLogs();
            },

            handleCurrentChange(val) {
                this.current = val;
                this.getLogs();
            },
            //获取用户列表
            getLogs() {
                let para = {
                    page:{
                        size: this.size,
                        current: this.current
                    },
                    condition: this.condition
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                //NProgress.start();
                getLogs(para).then((res) => {
                    // console.log(res);
                    if(res.meta.success) {
                        this.total = res.data.total;
                        this.logs = res.data.records;
                        this.listLoading = false;
                        //NProgress.done();
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },


        },
        mounted() {
            this.getLogs();
        }
    }

</script>

<style scoped>

</style>