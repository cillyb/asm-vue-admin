<template>
    <section>
        <div class="app-container">
            <el-row :gutter="20">
                <!--部门数据-->
                <el-col :span="4" :xs="24" style="width: 15%; ">
                    <div class="head-container" style="margin-top: 10px;">
                        设备类型
                    </div>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <div class="toolbar">
                        <el-button type="primary" size="mini" v-on:click="">新增</el-button>
                        <el-button type="primary" size="mini" v-on:click="">修改</el-button>
                        <el-button type="primary" size="mini" v-on:click="">删除</el-button>
                    </div>
                    <div class="head-container" style="height: 100%;">
                        <el-tree
                                node-key="id"
                                :data="data"
                                :props="defaultProps"
                                highlight-current
                                :expand-on-click-node="false"
                                default-expand-all
                                @node-click="handleNodeClick">

                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20" :xs="24">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="devices" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="assetName" label="设备名称" width="100" sortable>
            </el-table-column>
            <el-table-column prop="deviceNo" label="设备编号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="typeId" label="分类" width="100" sortable>
            </el-table-column>
            <el-table-column prop="provideEndTime" label="截止提供时间" width="120" sortable>
            </el-table-column>
            <el-table-column prop="firstCost" label="成本价格" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="" label="租赁价格" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="" label="分利比" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="" label="所属社区" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="status" label="设备状态" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="" label="设备二维码" min-width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
            </el-col>
            </el-row>
        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="addForm.typeId" placeholder="请选择">
<!--                        <el-option-->
<!--&lt;!&ndash;                                TODO 不分页的普通列表&ndash;&gt;-->
<!--                                v-for="item in typeOptions"-->
<!--                                :key="item.value"-->
<!--                                :label="item.label"-->
<!--                                :value="item.value">-->
<!--                        </el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        </div>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import { getTypeTree, getDevices, removeDevice } from '../../api/deviceApi'

    export default {
        data() {
            return {
                condition:{
                    "typeId":''
                },
                //treeData
                data:{},
                defaultProps:{
                    children: 'fork',
                    label: 'typeName'
                },

                filters: {
                    name: ''
                },
                devices: [],
                total: 0,
                size:20,
                current: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                }

            }
        },
        methods: {
            //获取树形设备类型
            getTypeTree() {
                let para = {
                };
                getTypeTree(para).then((res) => {
                    // console.log(res);
                    if(res.meta.success) {
                        this.data = res.data;
                        if(this.data.length != 0) {
                            console.log(this.data[0].id);
                            this.currentNodekey = this.data[0].id;
                            this.$refs.tree.setCheckedNodes(this.data[0]);
                        }
                        // console.log(this.data);
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
            },

            handleNodeClick(data){
                console.log(data.id);
                this.condition.typeId = data.id;
                this.getDevices();
            },

            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getDevices() {
                let para = {
                    page:{
                        size: this.size,
                        current: this.current
                    },
                    condition: util.filterParams(this.condition)
                };
                this.listLoading = true;
                //NProgress.start();
                getDevices(para).then((res) => {
                    // console.log(res);
                    if(res.meta.success) {
                        this.total = res.data.total;
                        this.devices = res.data.records;
                        this.listLoading = false;
                        //NProgress.done();
                    }
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: [] };
                    para.ids.push(row.id);
                    removeDevice(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if(res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDevices();
                        } else {
                            this.$message({
                                message: res.meta.message,
                                type: 'error'
                            });
                        }
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
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
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
                // var ids = this.sels.map(item => item.id).toString();
                var ids = [];
                for(var i = 0; i < this.sels.length; i++) {
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    removeDevice(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if(res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDevices();
                        } else {
                            this.$message({
                                message: res.meta.message,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getDevices();
            this.getTypeTree();
        }
    }

</script>

<style scoped>
</style>