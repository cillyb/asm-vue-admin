<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.modelName" placeholder="分利模板名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getShareholding">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="shareholding" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="id" label="模板id" sortable>
            </el-table-column>
            <el-table-column prop="modelName" label="模板名称" sortable>
            </el-table-column>
            <el-table-column prop="shareholdingPercent" label="分利百分比" :formatter="formatPercent" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            @change=changeSwitch(scope.row)>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="editForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分利百分比" prop="shareholdingPercent">
                    <el-input v-model.number="editForm.shareholdingPercent"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="addForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分利百分比" prop="shareholdingPercent">
                    <el-input v-model.number="addForm.shareholdingPercent"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'

    import { getShareholdingListPage, removeShareholding, addShareholding, editShareholding, isvalidSharing } from '../../api/settingApi';

    var validSharing=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入分利'))
        }else  if (!isvalidSharing(value)){
            callback(new Error('请输入正确的分利'))
        }else {
            callback()
        }
    };

    export default {
        data() {
            return {
                filters: {
                    modelName: ''
                },
                shareholding: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    modelName: [
                        { required: true, message: '请输入分利名称', trigger: 'blur' }
                    ],
                    shareholdingPercent: [
                        { required: true, trigger: 'blur', validator: validSharing }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    modelName: '',
                    shareholdingPercent: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    modelName: [
                        { required: true, message: '请输入分利名称', trigger: 'blur' }
                    ],
                    shareholdingPercent: [
                        { required: true, trigger: 'blur', validator: validSharing}
                    ]
                },
                //新增界面数据
                addForm: {
                    modelName: '',
                    shareholdingPercent: ''
                }
            }
        },
        methods: {
            //switch按钮点击触发事件，日后方便对分利状态进行修改
            changeSwitch(row){
                console.log(row.status);
            },

            //百分比显示格式转化
            formatPercent: function (row, column) {
                return row.shareholdingPercent+"%";
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getShareholding();
            },
            //获取分利列表
            getShareholding() {
                let para = {
                    page:{
                        current:this.page,
                        size:10
                    },
                    condition: this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getShareholdingListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.shareholding = res.data.records;
                    this.listLoading = false;
                });
            },
            //删除分利
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: [row.id] };
                    removeShareholding(para).then((res) => {
                        this.listLoading = false;
                        if(res.meta.success){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                        this.getShareholding();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    modelName: '',
                    shareholdingPercent: ''
                };
            },
            //编辑分利
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editShareholding(para).then((res) => {
                                this.editLoading = false;
                                if(res.meta.success){
                                    this.$message({
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                }else{
                                    this.$message({
                                        message:res.meta.message,
                                        type: 'error'
                                    });
                                }
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getShareholding();
                            });
                        });
                    }
                });
            },
            //新增分利
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            addShareholding(para).then((res) => {
                                this.addLoading = false;
                                if(res.meta.success){
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                }else{
                                    this.$message({
                                        message:res.meta.message,
                                        type: 'error'
                                    });
                                }
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getShareholding();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = [];
                for(var i = 0;i < this.sels.length; i++){
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: ids };
                    removeShareholding(para).then((res) => {
                        this.listLoading = false;
                        if(res.meta.success){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                        this.getShareholding();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getShareholding();
        }
    }

</script>

<style scoped>

</style>