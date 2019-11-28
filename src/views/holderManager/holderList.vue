<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.phoneNumber" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleQuery">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="holder"
                  highlight-current-row
                  v-loading="listLoading"
                  @selection-change="selsChange"
                  row-key="id"
                  lazy
                  :load="load"
                  :tree-props="{children: 'children', hasChildren: 'hasAsset'}"
                  style="width: 100%;">
<!--            <el-table-column type="index" style="width: 10%;">-->
<!--                <template scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>-->
<!--            </el-table-column>-->
            <el-table-column prop="idx" label="序号" align="center" width="70">
            </el-table-column>
            <el-table-column prop="userName" label="名称" style="width: 15%;" sortable>
            </el-table-column>
<!--            <el-table-column prop="assetName" label="设备名称" style="width: 15%;" sortable>-->
<!--            </el-table-column>-->
            <el-table-column prop="phoneNumber" label="手机号" style="width: 15%;" sortable>
            </el-table-column>
            <el-table-column prop="typeName" label="设备类型" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" :formatter="formatNo" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="shareholdingPercent" label="分利比" :formatter="formatPercent" style="width: 15%;" >
            </el-table-column>
            <el-table-column prop="totalShareBenefit" label="总收益" :formatter="formatBenefit" style="width: 10%;" >
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" style="width: 10%;" >
            </el-table-column>
            <el-table-column prop="lastUseTime" label="上次使用时间" style="width: 20%;" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" style="width: 20%;" sortable>
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
    import { getHolderListPage } from '../../api/holderApi';
    import { getDevices, getHolderDevices} from '../../api/deviceApi'
    import util from '../../common/js/util';

    export default {
        data() {
            return {
                filters: {
                    userName:'',
                    phoneNumber:''
                },
                holder: [],
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
            //设备编号添加No
            formatNo: function (row, column) {
                if(row.deviceNo != null) {
                    return "NO."+row.deviceNo;
                }
            },
            //设备状态格式化
            formatStatus: function (row, column) {
                if(row.assetName != null) {
                    return row.status == 0 ? "冻结    " : "正常";
                } else {
                    return null;
                }
            },
            //设备总收益格式化
            formatBenefit: function (row, column) {
                if(row.totalShareBenefit != null) {
                    return row.totalShareBenefit+"元";
                } else {
                    return null;
                }
            },


            load(tree, treeNode, resolve) {
                let para = {
                    page: {
                        size: 10000,
                        current: 1
                    },
                    condition: {
                        holderId:tree.id
                    }
                };
                getHolderDevices(para).then((res) => {
                    // console.log(res);
                    if (res.meta.success) {
                        let asset = res.data.records;
                        for(let i = 0; i < asset.length; i++) {
                            asset[i].phoneNumber = null;
                            asset[i].userName = asset[i].assetName;
                        }
                        resolve(asset);
                    }
                });
            },

            handleSizeChange(val) {
                this.size = val;
                this.getHolder();
            },
            handleQuery(){
                this.current = 1;
                this.getHolder();
            },
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
                        "size":this.size
                    },
                    "condition": this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getHolderListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.holder = res.data.records;
                    for(let i = 0; i < this.holder.length; i++) {
                        this.holder[i].idx = (this.page-1)*this.size+i+1;
                        if(this.holder[i].hasAsset == 0) {
                            this.holder[i].hasAsset = false;
                        } else {
                            this.holder[i].hasAsset = true;
                        }
                    }
                    console.log(this.holder);
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