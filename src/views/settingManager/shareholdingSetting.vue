<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.modelName" placeholder="分利模板名称" clearable></el-input>
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
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="shareholding" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index" label="序号">
            </el-table-column>
            <!--<el-table-column prop="id" label="模板id" sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="modelName" label="模板名称" sortable>
            </el-table-column>
            <el-table-column prop="shareholdingPercent" label="分利百分比" :formatter="formatPercent" sortable>
            </el-table-column>
<!--            <el-table-column prop="accountDate" label="每月结算日" :formatter="formatDate" sortable>-->
<!--            </el-table-column>-->
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
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="editForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="shareholdingPercent">
                    <span slot="label" >持有人分利 <br>(单位：%)</span>
                    <el-input v-model.number="editForm.shareholdingPercent" placeholder="最大30%"></el-input>
                    <el-tooltip class="item" effect="dark" content="指持有人会获得的获利比率" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
<!--                <el-form-item prop="accountDate">-->
<!--                    <span slot="label" >每月结账日</span>-->
<!--                    <el-input v-model.number="editForm.accountDate"></el-input>-->
<!--                    <el-tooltip class="item" effect="dark" content="指每月设定日子进行上一周期收益的转存" placement="right">-->
<!--                        <i class="el-icon-info"></i>-->
<!--                    </el-tooltip>-->
<!--                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editCancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" @close="addCancel" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="addForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="shareholdingPercent">
                    <span slot="label" >持有人分利 <br>(单位：%)</span>
                    <el-input v-model.number="addForm.shareholdingPercent"  placeholder="最大30%"></el-input>
                    <el-tooltip class="item" effect="dark" content="指持有人会获得的获利比率" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
<!--                <el-form-item prop="accountDate">-->
<!--                    <span slot="label" >每月结账日</span>-->
<!--                    <el-input v-model.number="addForm.accountDate"></el-input>-->
<!--                    <el-tooltip class="item" effect="dark" content="指每月设定日子进行上一周期收益的转存" placement="right">-->
<!--                        <i class="el-icon-info"></i>-->
<!--                    </el-tooltip>-->
<!--                </el-form-item>-->
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

    import { getShareholdingListPage, removeShareholding, addShareholding, editShareholding, isvalidSharing, openShareholding, closeShareholding, isvalidDate, isNumber } from '../../api/settingApi';

    var validSharing=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入分利'))
        }else if(!isNumber(value)) {
            callback(new Error('请输入正确的分利'))
        }else  if (!isvalidSharing(value)){
            callback(new Error('请输入正确的分利'))
        }else if(value > 30){
            callback(new Error('分利比最大只允许30%'))
        } else{
            callback()
        }
    };

    var validDate=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入结算日'))
        }else  if (!isvalidDate(value)){
            callback(new Error('结算日必须处于1到28号之间'))
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
                size: 10,
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
                    ],
                    accountDate: [
                        { required: true, trigger: 'blur', validator: validDate }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    modelName: '',
                    shareholdingPercent: '',
                    accountDate: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    modelName: [
                        { required: true, message: '请输入分利名称', trigger: 'blur' }
                    ],
                    shareholdingPercent: [
                        { required: true, trigger: 'blur', validator: validSharing}
                    ],
                    accountDate: [
                        { required: true, trigger: 'blur', validator: validDate}
                    ]
                },
                //新增界面数据
                addForm: {
                    modelName: '',
                    shareholdingPercent: '',
                    accountDate: ''
                }
            }
        },
        methods: {

            handleSizeChange(val) {
                this.size = val;
                this.getShareholding();
            },
            handleQuery(){
                this.current = 1;
                this.getShareholding();
            },
            //switch按钮点击触发事件，日后方便对分利状态进行修改
            changeSwitch(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openShareholding(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '分利模板已开启',
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
                    closeShareholding(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '分利模板已关闭',
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

            handleCurrentChange(val) {
                this.page = val;
                this.getShareholding();
            },
            //获取分利列表
            getShareholding() {
                let para = {
                    page:{
                        current:this.page,
                        size:this.size
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
                this.$confirm('确认删除该分利吗?', '提示', {
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
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
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
                        // });
                    }
                });
            },
            //新增分利
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
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
                var ids = [];
                for(var i = 0;i < this.sels.length; i++){
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中分利吗？', '提示', {
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
    .el-dialog .el-input{
        width: 25%;
    }

    .el-dialog .el-input-number{
        width: 25%;
    }

    .el-icon-info{
        margin-left: 10px;
        font-size: 20px;
    }

    .el-icon-info:hover{
        color: #409EFF;
    }

    .el-form-item span{
        display:inline-block;
        line-height:1.3;
    }
</style>