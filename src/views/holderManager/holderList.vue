<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="手机号/id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getHolder">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="holder" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" style="width: 10%;">
            </el-table-column>
            <el-table-column prop="id" label="持有人id" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号码" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="sex" label="性别" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="birthday" label="生日" style="width: 10%;" sortable>
            </el-table-column>
            <el-table-column prop="lastUseTime" label="上次使用时间" style="width: 20%;" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" style="width: 20%;" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import { getHolderListPage } from '../../api/holderApi';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                holder: [],
                total: 0,
                page: 1,
                listLoading: false,
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getHolder();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //获取持有人列表
            getHolder() {
                let para = {
                    "page":{
                        "current":this.page,
                        "size":10
                    },
                    "condition": {
                        "registBeginDate":"2017-07-27",
                        "registEndDate": "2020-08-29"
                    }
                };
                this.listLoading = true;
                getHolderListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.holder = res.data.records;
                    this.listLoading = false;
                });
            },
        },
        mounted() {
            this.getHolder();
        }
    }

</script>

<style scoped>

</style>