<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.communityName" placeholder="社区名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleQuery">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="community" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="communityName" label="社区名称" sortable>
            </el-table-column>
            <el-table-column prop="address" label="社区地址" sortable>
            </el-table-column>
            <el-table-column prop="manager" label="管理员" sortable>
            </el-table-column>
            <el-table-column prop="managerPhone" label="联系电话" sortable>
            </el-table-column>
            <el-table-column prop="onlineTimeBegin" label="开始营业时间" sortable>
            </el-table-column>
            <el-table-column prop="onlineTimeEnd" label="结束营业时间" sortable>
            </el-table-column>
            <el-table-column prop="longitude" label="经度" sortable>
            </el-table-column>
            <el-table-column prop="latitude" label="纬度" sortable>
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
            <el-table-column label="操作" width="150">
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
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" @close="editCancel" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
            <el-form-item label="社区名称" prop="communityName">
                <el-input v-model="editForm.communityName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input v-model="editForm.longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input v-model="editForm.latitude"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input type="textarea" v-model="editForm.address" auto-complete="off" style="width: 50%;"></el-input>
            </el-form-item>
            <el-form-item label="管理员" prop="manager">
                <el-input v-model="editForm.manager" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="managerPhone">
                <el-input v-model.number="editForm.managerPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="开始营业时间" prop="onlineTimeBegin">
                <el-time-select v-model="editForm.onlineTimeBegin" :picker-options="{start:'00:00',step: '00:30',end: '24:00'}"></el-time-select>
            </el-form-item>
            <el-form-item label="结束营业时间" prop="onlineTimeEnd">
                <el-time-select v-model="editForm.onlineTimeEnd" :picker-options="{start:'00:00',step: '00:30',end: '24:00'}"></el-time-select>
            </el-form-item>
            <el-form-item label="不营业时间" prop="noBusinessDates">
                <el-date-picker
                        type="dates"
                        v-model="editForm.noBusinessDates"
                        placeholder="选择一个或多个日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
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
            <el-form-item label="社区名称" prop="communityName">
                <el-input v-model="addForm.communityName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input v-model="addForm.longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input v-model="addForm.latitude"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input type="textarea" v-model="addForm.address" auto-complete="off" style="width: 50%;"></el-input>
            </el-form-item>
            <el-form-item label="管理员" prop="manager">
                <el-input v-model="addForm.manager" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="managerPhone">
                <el-input v-model="addForm.managerPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="开始营业时间" prop="onlineTimeBegin">
                <el-time-select v-model="addForm.onlineTimeBegin" :picker-options="{start:'00:00',step: '00:30',end: '24:00'}"></el-time-select>
            </el-form-item>
            <el-form-item label="结束营业时间" prop="onlineTimeEnd">
                <el-time-select v-model="addForm.onlineTimeEnd" :picker-options="{start:'00:00',step: '00:30',end: '24:00'}"></el-time-select>
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
    import { getCommunityListPage, removeCommunity, addCommunity, editCommunity, isvalidPhone, isvalidTel, openCommunity, closeCommunity } from '../../api/communityApi';
    import util from '../../common/js/util'

    //手机号码验证
    var validPhone=(rule, value,callback)=>{
        // console.log("validTel : " + isvalidTel(value));
        if (!value){
            callback(new Error('请输入电话号码'))
        }else  if (!isvalidPhone(value) && !isvalidTel(value)){
            callback(new Error('请输入正确的11位手机号码或座机号码'))
        }else {
            callback()
        }
    }

    export default {
        data() {
            return {
                filters: {
                    communityName: ''
                },
                community: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    communityName: [
                        { required: true, message: '请输入社区名称', trigger: 'blur' }
                    ],
                    longitude: [
                        { required: true, message: '请输入经度', trigger: 'blur' }
                    ],
                    latitude: [
                        { required: true, message: '请输入纬度', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    manager: [
                        { required: true, message: '请输入管理员', trigger: 'blur' }
                    ],
                    managerPhone: [
                        { required: true, trigger: 'blur', validator: validPhone }
                    ],
                    onlineTimeBegin: [
                        { required: true, message: '请输入开始营业时间', trigger: 'blur' }
                    ],
                    onlineTimeEnd: [
                        { required: true, message: '请输入结束营业时间', trigger: 'blur' }
                    ],
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    noBusinessDates: '',
                    communityName: '',
                    longitude: '',
                    latitude: '',
                    address: '',
                    manager: '',
                    managerPhone: '',
                    onlineTimeBegin: '',
                    onlineTimeEnd: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    communityName: [
                        { required: true, message: '请输入社区名称', trigger: 'blur' }
                    ],
                    longitude: [
                        { required: true, message: '请输入经度', trigger: 'blur' }
                    ],
                    latitude: [
                        { required: true, message: '请输入纬度', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    manager: [
                        { required: true, message: '请输入管理员', trigger: 'blur' }
                    ],
                    managerPhone: [
                        { required: true, trigger: 'blur', validator: validPhone }
                    ],
                    onlineTimeBegin: [
                        { required: true, message: '请输入开始营业时间', trigger: 'blur' }
                    ],
                    onlineTimeEnd: [
                        { required: true, message: '请输入结束营业时间', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    communityName: '',
                    longitude: '',
                    latitude: '',
                    address: '',
                    manager: '',
                    managerPhone: '',
                    onlineTimeBegin: '',
                    onlineTimeEnd: ''
                }

            }
        },
        methods: {

            handleSizeChange(val) {
                this.size = val;
                this.getCommunity();
            },
            handleQuery(){
                this.current = 1;
                this.getCommunity();
            },

            //switch按钮点击触发事件，日后方便对社区状态进行修改
            changeSwitch(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openCommunity(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '社区已开启',
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
                    closeCommunity(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '社区已关闭',
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

            //社区状态显示转换，1表示开启，0表示关闭
            formatStatus: function (row, column) {
                return row.status == 1 ? '开启' : row.status == 0 ? '关闭' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getCommunity();
            },
            //获取社区列表
            getCommunity() {
                let para = {
                    "page":{
                        "current":this.page,
                        "size":this.size
                    },
                    "condition": this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getCommunityListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.community = res.data.records;
                    this.listLoading = false;
                });
            },
            //删除社区
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: [row.id] };
                    removeCommunity(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
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
                        this.getCommunity();
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
                   communityName: '',
                   longitude: '',
                   latitude: '',
                   address: '',
                   manager: '',
                   managerPhone: '',
                   onlineTimeBegin: '',
                   onlineTimeEnd: ''
               };
           },
            //编辑社区
           editSubmit: function () {
               this.$refs.editForm.validate((valid) => {
                   var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                   if(regPos.test(this.editForm.longitude) && regPos.test(this.editForm.latitude)){
                       if (valid) {
                           this.$confirm('确认提交吗？', '提示', {}).then(() => {
                               this.editLoading = true;
                               let para = Object.assign({}, this.editForm);
                               var communityNoBusinessSetList = [];
                               if(para.noBusinessDates!=null){
                                   for(var i=0;i<para.noBusinessDates.length;i++){
                                       communityNoBusinessSetList.push({"noBusinessDate":para.noBusinessDates[i]});
                                   }
                               }
                               para.communityNoBusinessSetList = communityNoBusinessSetList;
                               editCommunity(para).then((res) => {
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
                                   this.getCommunity();
                               });
                           });
                       }
                   }else{
                       this.$message({
                           message:"输入正确的经纬度",
                           type: 'error'
                       });
                   }

               });
           },
            //新增社区
           addSubmit: function () {
               this.$refs.addForm.validate((valid) => {
                   var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                   if(regPos.test(this.addForm.longitude) && regPos.test(this.addForm.latitude)) {
                       if (valid) {
                           // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                               this.addLoading = true;
                               let para = Object.assign({}, this.addForm);
                               addCommunity(para).then((res) => {
                                   this.addLoading = false;
                                   if (res.meta.success) {
                                       this.$message({
                                           message: '新增成功',
                                           type: 'success'
                                       });
                                   } else {
                                       this.$message({
                                           message: res.meta.message,
                                           type: 'error'
                                       });
                                   }
                                   this.$refs['addForm'].resetFields();
                                   this.addFormVisible = false;
                                   this.getCommunity();
                               });
                           // });
                       }
                   }else{
                       this.$message({
                           message:"输入正确的经纬度",
                           type: 'error'
                       });
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
                var ids = [];
                for(var i = 0;i < this.sels.length; i++){
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: ids };
                    removeCommunity(para).then((res) => {
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
                        this.getCommunity();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getCommunity();
        }
    }

</script>

<style scoped>
    .el-dialog .el-input{
        width: 25%;
    }
</style>