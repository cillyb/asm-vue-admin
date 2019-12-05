<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            手机号码:&nbsp;
            <el-input v-model="condition.phoneNumber" style="width:10%" maxlength="11" clearable></el-input>
            &nbsp;&nbsp;注册时间:&nbsp;
            <el-date-picker type="date" placeholder="开始日期" v-model="condition.registBeginDate" value-format="yyyy-MM-dd" style="width:12%"></el-date-picker>
            &nbsp;-&nbsp;
            <el-date-picker type="date" placeholder="结束日期" v-model="condition.registEndDate" value-format="yyyy-MM-dd" style="width:12%"></el-date-picker>
            <el-button type="primary" v-on:click="handleQuery">查询</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                   style="width: 100%; ">
<!--            <el-table-column type="selection" >-->
<!--            </el-table-column>-->
            <el-table-column type="index" label="序号" >
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="用户名" >
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" >
            </el-table-column>
            <el-table-column prop="lastUseDeviceId" label="最近使用的设备"  >
            </el-table-column>
            <el-table-column prop="lastUseTime" label="最近使用的时间" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="使用频率高的设备" >
            </el-table-column>
            <el-table-column prop="status" label="状态" >
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
            <el-table-column label="操作"  header-align="center" align="center">
                <template scope="scope">
                    <el-dropdown trigger="click">
                        <el-button size="medium" type="primary">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">编辑</el-dropdown-item>
                            <el-dropdown-item @click.native="handleDel(scope.$index, scope.row)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
<!--            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" @close="editCancel" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="editForm.phoneNumber" disabled="true" auto-complete="off" maxlength="11" style="width: 25%"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName" placeholder="为持有人时用户名必填" auto-complete="off" maxlength="10" style="width: 25%"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" v-model="editForm.sex" label="男">男</el-radio>
                        <el-radio class="radio" v-model="editForm.sex" label="女">女</el-radio>
                        <el-radio class="radio" v-model="editForm.sex" label="其他">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否为持有人" prop="isHolder">
                    <el-radio-group v-model="editForm.isHolder">
                        <el-radio class="radio" :label="1">是</el-radio>
                        <el-radio class="radio" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker type="date" style="width: 25%" placeholder="选择日期" v-model="editForm.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editCancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" @close="addCancel" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="addForm.phoneNumber" auto-complete="off" maxlength="11" style="width: 25%"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName" placeholder="为持有人时用户名必填" auto-complete="off" maxlength="10" style="width: 25%"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" v-model="addForm.sex" label="男">男</el-radio>
                        <el-radio class="radio" v-model="addForm.sex" label="女">女</el-radio>
                        <el-radio class="radio" v-model="addForm.sex" label="其他">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否为持有人" prop="isHolder">
                    <el-radio-group v-model="addForm.isHolder">
                        <el-radio class="radio" :label="1">是</el-radio>
                        <el-radio class="radio" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker type="date" style="width: 25%" placeholder="选择日期" v-model="addForm.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addCancel">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import { getUserListPage, addUser, editUser, removeUser, openUser, closeUser } from "../../api/userApi"

    export default {
        data() {
            return {
                condition: {
                    phoneNumber:'',
                    registBeginDate:'',
                    registEndDate:''
                },
                users: [],
                total:0,
                size: 10,
                current: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    phoneNumber: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    isHolder: [
                        { required: true, message: '请选择是否为持有人', trigger: 'blur' }
                    ],
                },
                //编辑界面数据
                editForm: {
                    phoneNumber: '',
                    sex: '',
                    birthday: '',
                    isHolder: '',
                    userName:'',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    phoneNumber: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    isHolder: [
                        { required: true, message: '请选择是否为持有人', trigger: 'blur' }
                    ],
                },
                //新增界面数据
                addForm: {
                    phoneNumber: '',
                    sex: '',
                    birthday: '',
                    isHolder: '',
                    userName:'',
                    assetCount:'',
                }

            }
        },
        methods: {
            handleSizeChange(val) {
                this.size = val;
                this.getUsers();
            },

            handleQuery(){
                this.current = 1;
                this.getUsers();
            },

            //switch按钮点击触发事件，日后方便对社区状态进行修改
            changeSwitch(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openUser(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '用户被激活',
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
                    closeUser(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '用户被拉入黑名单',
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

            handleCurrentChange(val) {
                this.current = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    page:{
                        size: this.size,
                        current: this.current
                    },
                    condition: this.condition
                };
                para.condition = util.filterParams(para.condition);
                if(para.condition.registBeginDate != null && para.condition.registEndDate != null) {
                    if(para.condition.registBeginDate > para.condition.registEndDate) {
                        this.$message({
                            message: '开始时间不能晚于结束时间',
                            type: 'error'
                        });
                        return ;
                    }
                }
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    // console.log(res);
                    if(res.meta.success) {
                        this.total = res.data.total;
                        this.users = res.data.records;
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
                    if(row.isHolder == 1 && row.assetCount > 0) {
                        this.$message({
                            message: '该用户为持有人且当前持有设备，不能被删除！',
                            type: 'error'
                        })
                        return;
                    }
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: [] };
                    para.ids.push(row.id);
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if(res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
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
                this.addForm = {
                    phoneNumber: '',
                    sex: '',
                    birthday: '',
                    isHolder: '',
                    userName: '',
                };
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            if(para.isHolder == 0 && para.assetCount > 0) {
                                this.$message({
                                    message: '该持有人持有设备不能被变更状态！',
                                    type: 'error'
                                })
                                return;
                            }
                            if(para.isHolder == 1 && (para.userName == '' || para.userName == null)) {
                                this.$message({
                                    message: '持有人必须填写用户名！',
                                    type: 'error'
                                })
                                return;
                            }
                            this.editLoading = true;
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                if(res.meta.success) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getUsers();
                                } else {
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        // });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            if(para.isHolder == 1 && (para.userName == '' || para.userName == null)) {
                                this.$message({
                                    message: '持有人必须填写用户名！',
                                    type: 'error'
                                })
                                return;
                            }
                            this.addLoading = true;
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            console.log(para);
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                if(res.meta.success) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getUsers();
                                } else {
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        // });
                    }
                });
            },
            addCancel: function(){
                this.$refs.addForm.resetFields();
                this.addFormVisible = false;
            },
            editCancel: function(){
                this.$refs.editForm.resetFields();
                this.editFormVisible = false;
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
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if(res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
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
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>